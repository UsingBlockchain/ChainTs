/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import sha256 from 'fast-sha256';
import {getShortened} from '../kernel/Helpers'

export class Block {

  /**
   * Binary data inside the block.
   * @var Buffer
   */
  public binary: Buffer

  /**
   * Hexadecimal block hash (sha256)
   * @var string
   */
  public blockHash: string

  /**
   * Construct a block instance.
   *
   * @param   number  height          The block height (or index).
   * @param   string  previousHash    The previous block hash.
   * @param   number  timestamp       The timestamp (date of creation).
   * @param   string  data            The data added to the block.
   * @param   number  difficulty      The difficulty for mining this block.
   * @param   number  nonce           The nonce at which to start mining.
   */
  protected constructor(
    public readonly height: number,
    public readonly previousHash: string,
    public readonly timestamp: number,
    public readonly data: string,
    public readonly difficulty: number = 1,
    public nonce: number = 0,
  ) {
    // - Convert to binary
    this.binary = Buffer.from(data, 'utf8');

    // - Calculate block hash
    this.blockHash = Block.calculateHash(this);
  }

  /**
   * Mine a block's hash to match a minimum \a difficulty
   * of leading zeros. This method increases an internal
   * nonce and calculates SHA-256 hashes of a block.
   * 
   * @param   number  difficulty
   * @return  Block
   */
  public mineBlock(
    difficulty: number = 1
  ): Block {
    let leadingZeros = '0'.repeat(difficulty)

    this.nonce = 0
    while (this.blockHash.substring(0, difficulty) != leadingZeros) {
      this.nonce++;
      this.blockHash = Block.calculateHash(this);
    }

    return this
  }

  /**
   * Return string formatted block information.
   *
   * @return string
   */
  public toString() {
    return (
      '#' + this.height + ' ' +
      'Hash: ' + getShortened(this.blockHash) + '; ' +
      'Nonce: ' + this.nonce + '; ' +
      'Previous: ' + getShortened(this.previousHash) + '; ' +
      'Time: ' + this.timestamp
    );
  }

  /**
   * Create a block instance around \a height. The block
   * can be filled with \a data and linked to \a previous
   * block hash.
   *
   * If left empty, the previous block hash
   * will be 32 zero-bytes and the returned block is then
   * considered a **genesis block** (first block).
   *
   * @param   number  height     The 0-starting height of the block (in the chain).
   * @param   string  data      (Optional) The data added to the block. Defaults to empty string.
   * @param   string  previous  (Optional) The previous block hash to link. Defaults to 32 zero-bytes.
   * @return  Block   The formatted block model instance.
   */
  public static create(
    height: number,
    data: string = '',
    previous: string = null,
    difficulty: number = 1,
    nonce: number = 0,
  ): Block {
    const prev = !!previous && previous.length === 64 ? previous : '0'.repeat(64);
    const time = (new Date()).valueOf();
    return new Block(height, prev, time, data, difficulty, nonce);
  }

  /**
   * Create a hexadecimal hash (32 bytes) of the block
   * using the `SHA-256` hashing algorithm.
   *
   * This method construct a block payload which consists
   * in a concatenation of **hexadecimal notations** of 
   * parts of the block with the following format:
   *
   * block number || previous block hash || timestamp || difficulty || nonce || data
   *
   * @param   number  height     The 0-starting height of the block (in the chain).
   * @param   string  data      (Optional) The data added to the block. Defaults to empty string.
   * @param   string  previous  (Optional) The previous block hash to link. Defaults to 32 zero-bytes.
   * @return  Block   The formatted block model instance.
   */
  public static calculateHash(
    block: Block,
  ): string {
    // - Construct the block payload
    const payload = Buffer.from((
      block.height.toString(16)
      + block.previousHash
      + block.timestamp.toString(16)
      + block.difficulty.toString(16)
      + block.nonce.toString(16)
      + block.binary.toString('hex')
    ), 'hex')

    return Buffer.from(sha256(payload)).toString('hex');
  }
}

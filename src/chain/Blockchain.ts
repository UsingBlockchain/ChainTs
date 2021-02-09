/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { Block } from './Block'

export class Blockchain {
  /**
   * Start a new blockchain with a new genesis block
   * using \a difficulty number of leading zeros in 
   * the block hash.
   *
   * @param   number    difficulty 
   * @param   Block[]   blocks 
   */
  protected constructor(
    public readonly genesis: string,
    public readonly difficulty: number,
    public readonly blocks: Block[] = [],
  ) {
    // - Blockchain always starts with genesis block
    var genesisBlock = Block.create(0, genesis, null, this.difficulty);
    genesisBlock.mineBlock(this.difficulty);

    // - Push block
    this.blocks.push(genesisBlock);
  }

  /**
   * Creates a new blockchain around \a data using
   * \a difficulty number of leading zeros in the 
   * block hash.
   *
   * @param   string  data        The data to be added to the genesis block.
   * @param   number  difficulty  The difficulty or number of leading zeros.
   * @return  Blockchain
   */
  public static create(
    data: string,
    difficulty: number,
  ): Blockchain {
    return new Blockchain(data, difficulty)
  }

  /**
   * Create a new block instance. The created block
   * always bases on the previous block in storage.
   *
   * @param   string  data    The data that will be added.
   * @return  Block
   */
  public createBlock(
    data: string
  ): Block {
    // - Grow the chain
    const previous = this.blocks[this.blocks.length - 1];

    // - Create new instance
    return Block.create(
      previous.height + 1,
      data,
      previous.blockHash,
      this.difficulty,
      0
    );
  }

  /**
   * Appends a block to the chain of blocks. This
   * method is responsible for starting a block
   * mining process and appending the mined block
   * to the storage.
   * 
   * @param   Block   block   The block that will be mined.
   * @return  Blockchain
   */
  public appendBlock(
    block: Block,
  ): Blockchain {
    // - Mine the block (potentially blocking)
    block.mineBlock(this.difficulty)

    // - Append to chain
    this.blocks.push(block)
    return this
  }
}

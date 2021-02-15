/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { Block } from './Block'
import { Block as BlockContract } from '../contracts/Block'

export class Blockchain {
  /**
   * Start a new blockchain with a new genesis block
   * using \a difficulty number of leading zeros in 
   * the block hash.
   *
   * @param   string      genesis     The genesis message. 
   * @param   number      difficulty  The difficulty (number of leading zeroes).
   * @param   Block[]     blocks      The blocks of the blockchain.
   * @param   PeerToPeer  network     The peer-to-peer connection.
   */
  protected constructor(
    public readonly genesis: string,
    public readonly difficulty: number,
    public readonly blocks: Block[] = [],
  ) {
    if (! this.blocks.length) {
      // - Blockchain always starts with genesis block
      var genesisBlock = Block.create(0, genesis, null, this.difficulty);
      this.appendBlock(genesisBlock)
    }
  }

  /**
   * Creates a new blockchain around \a data using
   * \a difficulty number of leading zeros in the 
   * block hash.
   *
   * @param   string      data        The data to be added to the genesis block.
   * @param   number      difficulty  The difficulty or number of leading zeros.
   * @param   PeerToPeer  network     The peer-to-peer connection.
   * @return  Blockchain
   */
  public static create(
    data: string,
    difficulty: number,
  ): Blockchain {
    return new Blockchain(data, difficulty, [])
  }

  /**
   * Re-create a chain of blocks from a storage
   * contract.
   *
   * @param   BlockContract   blocks    The list of blocks from storage.
   * @return  Blockchain
   */
  public static createFromStorage(
    blocks: BlockContract[]
  ): Blockchain {
    // - Get first block data ("genesis data")
    const genesis = blocks[0].data

    // - Use last difficulty
    const difficulty = blocks[blocks.length-1].difficulty

    // - Re-create blockchain
    return new Blockchain(genesis, difficulty, blocks.map((b) => b as Block))
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

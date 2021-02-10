/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { Block } from './Block'
import { Blockchain } from './Blockchain'

export class Auditor {

  /**
   * Construct a block chain auditor.
   *
   * @param   Blockchain  chain
   */
  public constructor(
    public readonly chain: Blockchain
  ) {}

  /**
   * Verify the integrity of a chain of blocks. This method iterates
   * through all available blocks and validates their height, hashes
   * and previous block links.
   *
   * @return  boolean
   */
  public verify(): boolean {
    // - Iterate all blocks in the chain
    for (let i = 0, m = this.chain.blocks.length; i < m; i++) {
      if (true === this.verifyBlock(i)) {
        continue;
      }

      // - Bail out given corruption
      return false
    }

    // - Full chain audited
    return true
  }

  /**
   * Verify a block at \a height index. This method verifies a block
   * with (1) checking for the correct height, (2) checking for the 
   * correct chaining of previous block, (3) checking the calculated
   * SHA-256 hash of the block to be able to guarantee data integrity.
   * 
   * @param   number    height    The block height to retrieve and verify.
   * @return  boolean
   */
  protected verifyBlock(
    height: number = 0,
  ): boolean {
    // - Make sure we have a valid height
    if (height < 0 || height >= this.chain.blocks.length) {
      return false
    }

    // - Retrieve block and previous block
    const block: Block = this.chain.blocks[height]
    const previous: Block = height > 0 ? this.chain.blocks[height-1] : null

    // - Check for height mismatch
    if (height !== block.height) {
      return false
    }

    // - Check for chain height corruption
    if (null !== previous && previous.height !== height - 1) {
      return false
    }

    // - Check for data corruption
    if (null === block.blockHash || (
      Block.calculateHash(block) !== block.blockHash
    )) {
      return false
    }

    // - Done verifying block
    return true
  }

}

/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
export interface Block {
  /**
   * The block height
   * @var number
   */
  height: number

  /**
   * The previous block hash
   * @var string
   */
  previousHash: string

  /**
   * Hexadecimal block hash (sha256)
   * @var string
   */
  blockHash: string

  /**
   * The block timestamp
   * @var number
   */
  timestamp: number

  /**
   * The data stored in this block
   * @var string
   */
  data: string

  /**
   * The difficulty to mine this block
   * @var number
   */
  difficulty: number

  /**
   * The nonce used to find this block
   * @var string
   */
  nonce: number

  /**
   * Binary data inside the block (binary copy of `data`).
   * @var Buffer
   */
  binary: Buffer
}

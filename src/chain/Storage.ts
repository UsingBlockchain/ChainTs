/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
const fs = require('fs')
import { Blockchain } from './Blockchain'

export class Storage {
  /**
   * Storage path (path to folder)
   * @var string
   */
  protected path: string

  /**
   * File name
   * @var string
   */
  protected file: string

  /**
   * Construct a block chain storage.
   *
   * @param   Blockchain  chain
   */
  public constructor(
    public readonly name: string,
    public readonly chain?: Blockchain
  ) {
    this.path = __dirname + '/../../data/'
    this.file = name.replace(/\.json$/, '') + '.json'

    // - Validate storage capacity
    if (! fs.existsSync(this.path)) {
      throw 'Storage path: ' + this.path + ' does not exist.'
    }

    // - Re-create from storage when necessary
    if (! this.chain && fs.existsSync(this.filepath)) {
      const json = fs.readFileSync(this.filepath).toString()
      this.chain = Blockchain.createFromStorage(JSON.parse(json))
    }
  }

  /**
   * Get the storage file path (full path)
   *
   * @return string
   */
  public get filepath(): string {
    return this.path + this.file
  }

  /**
   * Save the blockchain information to storage.
   *
   * @return  string   The storage file path.
   */
  public save() {
    // - Save to filesystem
    fs.writeFileSync(this.filepath, JSON.stringify(
      this.chain.blocks
    ))
    return this.filepath
  }

}

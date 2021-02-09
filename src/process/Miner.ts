/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import {command, metadata, option} from 'clime';
import chalk from 'chalk';

import {OptionsResolver} from '../kernel/OptionsResolver';
import {Process, ProcessInputs} from '../kernel/Process';
import {getShortened} from '../kernel/Helpers'
import {description} from './default'
import {Block} from '../chain/Block'
import {Blockchain} from '../chain/Blockchain'

export class MinerInputs extends ProcessInputs {
  @option({
    flag: 'm',
    description: 'The message or data added to the genesis block.',
  })
  message: string;

  @option({
    flag: 'D',
    description: 'The difficulty of finding blocks (i.e. number of leading zeros).',
  })
  difficulty: number;

  @option({
    flag: 'b',
    description: 'The number of blocks to mine.',
  })
  blocks: number;
}

@command({
  description: 'ChainTs Blockchain Miner showcased in UBC Digital Magazine (https://ubc.digital)',
})
export default class extends Process {

  constructor() {
      super();
  }

  /**
   * Get the name of the process.
   *
   * @return  string  The name of the process
   */
  public getName(): string {
    return 'Miner'
  }

  /**
   * Execution routine for the `Miner` process.
   *
   * @param   MinerInputs   inputs
   * @return  Promise<any>
   */
  @metadata
  async execute(
    inputs: MinerInputs,
  ): Promise<any> {
    // - Display project information
    console.log(description)

    // - Read arguments
    let argv: ProcessInputs
    try {
      argv = await this.configure(inputs)
    }
    catch (e) {
      console.log("ERROR: ", e);
      this.error(e)
    }

    try {
      inputs['message'] = OptionsResolver(argv,
        'message',
        () => { return ''; },
        '\nEnter a message for the genesis block: ');
    } catch (err) { this.error('Please, enter a valid message.'); }

    try {
      inputs['difficulty'] = OptionsResolver(argv,
        'difficulty',
        () => { return ''; },
        '\nEnter the difficulty or number of leading zeros (e.g.: 3): ');
    } catch (err) { this.error('Please, enter a valid difficulty number.'); }

    try {
      inputs['blocks'] = OptionsResolver(argv,
        'blocks',
        () => { return ''; },
        '\nEnter the number of blocks that will be mined: ');
    } catch (err) { this.error('Please, enter a valid number of blocks.'); }

    // - Run the magic
    return await this.executeProcess(inputs);
  }

  /**
   * Execute the **miner** process
   *
   * @param   ProcessInputs   inputs
   * @return  Promise<any>
   */
  protected async executeProcess(
    inputs: ProcessInputs,
  ): Promise<any> {

    let message: string = inputs['message']
    let difficulty: number = inputs['difficulty']
    let maxBlocks: number = inputs['blocks']

    // - Create genesis block (initialize blockchain)
    let blockchain: Blockchain = Blockchain.create(message, difficulty)
    console.log(chalk.yellow(blockchain.blocks[0].toString()))

    // - Create at max `-b` blocks
    while(blockchain.blocks.length < maxBlocks) {

      // - Search for matching block hash
      let block: Block = blockchain.createBlock('Another block');

      // - Start mining process
      blockchain.appendBlock(block)
      console.log(chalk.yellow(block.toString()))
    }

    return new Promise((resolve, reject) => {
      return resolve('Done mining blocks')
    });
  }
}

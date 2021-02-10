/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { command, metadata, option } from 'clime';
import chalk from 'chalk';

import { OptionsResolver } from '../kernel/OptionsResolver';
import { Process, ProcessInputs } from '../kernel/Process';
import { description } from './default'
import { Block } from '../chain/Block'
import { Blockchain } from '../chain/Blockchain'
import { Auditor } from '../chain/Auditor';

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

  /**
   * This hash is only filled when data is verified.
   * @var string
   */
  protected secureDataHash: string = null

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
  ): Promise<number> {
    // - Read arguments
    let argv: ProcessInputs
    try {
      argv = await this.configure(inputs)
    }
    catch (e) {
      console.log("ERROR: ", e);
      this.error(e)
    }

    // - Display project information
    this.log(description)

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

    // - Run the block miner
    const isValid = await this.executeProcess(inputs);

    // - Shutdown process
    return new Promise((resolve, reject) => {
      if (! isValid) {
        return reject(chalk.red('Data corruption detected!'))
      }

      // - Make human readable
      this.log('')
      this.log(chalk.yellow('Data integrity verified: ') + chalk.green('Yes'))
      this.log(chalk.yellow('Secure blockchain hash:  ') + this.secureDataHash)
      this.log('')

      // - In quiet mode, log no more than secure data hash
      if ('quiet' in inputs && inputs['quiet']) {
        console.log(this.secureDataHash)
      }

      return process.exit(0)
    });
  }

  /**
   * Execute the **miner** process
   *
   * @param   ProcessInputs   inputs
   * @return  Promise<any>
   */
  protected async executeProcess(
    inputs: ProcessInputs,
  ): Promise<boolean> {

    let message: string = inputs['message']
    let difficulty: number = inputs['difficulty']
    let maxBlocks: number = inputs['blocks']

    // - Create genesis block (initialize blockchain)
    let blockchain: Blockchain = Blockchain.create(message, difficulty)
    this.log(chalk.yellow(blockchain.blocks[0].toString()))

    // - Create at max `-b` blocks
    while(blockchain.blocks.length < maxBlocks) {

      // - Search for matching block hash
      let block: Block = blockchain.createBlock('Another block');

      // - Start mining process
      blockchain.appendBlock(block)
      this.log(chalk.yellow(block.toString()))
    }

    // - Audit the chain of blocks
    const verified = (new Auditor(blockchain)).verify()
    const numBlocks = blockchain.blocks.length

    // - If data is auditable, store last hash
    if (true === verified) {
      this.secureDataHash = blockchain.blocks[numBlocks - 1].blockHash
    }

    return new Promise((resolve) => resolve(verified));
  }
}

/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import { command, metadata, option } from 'clime';
import chalk from 'chalk';

import { OptionsResolver } from '../kernel/OptionsResolver';
import { Process, ProcessInputs } from '../kernel/Process';
import { description } from './default'
import { Blockchain } from '../chain/Blockchain'
import { Storage } from '../chain/Storage';
import { Auditor } from '../chain/Auditor';

export class ValidatorInputs extends ProcessInputs {
  @option({
    flag: 'n',
    description: 'The name of the blockchain network.',
  })
  name: string;
}

@command({
  description: 'ChainTs Blockchain Validator showcased in UBC Digital Magazine (https://ubc.digital)',
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
    return 'Validator'
  }

  /**
   * Execution routine for the `Validator` process.
   *
   * @param   ValidatorInputs   inputs
   * @return  Promise<any>
   */
  @metadata
  async execute(
    inputs: ValidatorInputs,
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
      inputs['name'] = OptionsResolver(argv,
        'name',
        () => { return ''; },
        '\nEnter a name for the blockchain network: ');
    } catch (err) { this.error('Please, enter a valid name.'); }

    // - Run the blocks validator
    const isValid = await this.executeProcess(inputs);

    // - Shutdown process
    return new Promise((resolve, reject) => {
      if (! isValid) {
        return reject(chalk.red('Data corruption detected!'))
      }

      // - Make human readable
      this.log('')
      this.log(chalk.yellow('Data integrity verified: ') + chalk.green('Yes'))
      this.log('')

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

    let name: string = inputs['name']

    // - Re-create from storage
    const storage = new Storage(inputs['name'])
    let blockchain: Blockchain = storage.chain

    // - Verify the validaty of storage data
    const verified = (new Auditor(blockchain)).verify()
    return new Promise((resolve) => resolve(verified));
  }
}

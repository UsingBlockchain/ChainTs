/**
 * Part of BlockSnippets shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import {Command, Options, option} from 'clime';

export class ProcessInputs extends Options {
  @option({
    flag: 'd',
    description: 'Enables debug mode',
  })
  debug: boolean;

  @option({
    flag: 'q',
    description: 'Enables quiet mode',
  })
  quiet: boolean;
}

export abstract class Process extends Command {

  protected argv: ProcessInputs

  constructor() {
    super();
  }

/// begin region Abstract Methods
  /**
   * Get the name of the executed process.
   *
   * @return  string  The name of the process.
   */
  public abstract getName(): string

  /**
   * Execute a process with \a inputs.
   *
   * @param   ProcessInputs   inputs  The process arguments.
   * @return  Promise<any>    The output/result value(s).
   */
  protected abstract executeProcess(
    inputs: ProcessInputs,
  ): Promise<any>
/// end region Abstract Methods

  /**
   * Display an error message and exit
   *
   * @internal
   * @param e 
   */
  public error(e) {
    console.error(e)
    process.exit(1)
  }

  /**
   * Display a message depending on current
   * verbosity level.
   *
   * @internal
   * @param e 
   */
  public log(message: string) {
    // - Display in case no verbosity configured
    if (!this.argv || !Object.keys(this.argv).length) {
      console.log(message);
    }
    // - Also display in case of debug mode verbosity
    else if ('debug' in this.argv && this.argv['debug']) {
      console.log(message);
    }
    // - Also display when quiet mode is disabled
    else if (!('quiet' in this.argv) || !this.argv['quiet']) {
      console.log(message);
    }
  }

  /**
   * Configures an executable process.
   *
   * @internal
   * @access  protected
   * @param   ProcessInputs   inputs  The process arguments.
   * @return  Promise<ProcessInputs>  The list of arguments / inputs passed at runtime.
   */
  protected async configure(
    inputs: ProcessInputs,
  ): Promise<ProcessInputs> {
    this.argv = inputs;

    // done configuring
    return new Promise((resolve) => resolve(inputs));
  }
}

/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import {CLI, Shim} from 'clime';
import * as Path from 'path';

// The second parameter is the path to folder that contains command modules.
const cli = new CLI('ChainTs', Path.join(__dirname, 'process'));

// Clime in its core provides an object-based command-line infrastructure.
// To have it work as a common CLI, a shim needs to be applied:
const shim = new Shim(cli);
shim.execute(process.argv);

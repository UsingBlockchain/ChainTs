/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
import * as readlineSync from 'readline-sync';

/**
 * Generic command line argument reader.
 *
 * @param options 
 * @param key 
 * @param secondSource 
 * @param promptText 
 * @param readlineDependency
 * @return {any}
 */
export const OptionsResolver = (
    options: any,
    key: string,
    secondSource: () => string | undefined,
    promptText: string,
    readlineDependency?: any
): any => {
    const readline = readlineDependency || readlineSync;
    return options[key] !== undefined ? options[key] : (secondSource() 
        || readline.question(promptText));
};

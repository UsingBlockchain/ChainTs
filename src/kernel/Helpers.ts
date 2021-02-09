/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */

import { Block } from "../chain/Block"

/**
 * Get a shortened version of a string.
 *
 * @param   string  hash
 * @param   number  chars
 * @param   string  separator
 * @return  string
 */
export const getShortened = (
  hash: string,
  chars: number = 12,
  separator: string = '...',
): string => {
  // - /0
  if (chars <= 0) chars = 12
  const length = Math.floor(chars/2)

  // - Return shortened version
  return hash.substr(0, length) 
    + separator
    + hash.substr(-length)
}

/**
 * Part of ChainTs shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 */
const server = require('http').createServer(),
      broker = require('socket.io-p2p-server').Server,
      backend = require('socket.io')(server),
      frontend = require('socket.io-client')

import { Block } from '../chain/Block'

export class PeerToPeer {
  /**
   * Our list of clients
   * @var   Array
   */
  protected clients: (typeof frontend)[] = []

  /**
   * Construct a peer-to-peer connection.
   *
   * @return PeerToPeer
   */
  public constructor() {
    // - Setup connection broker
    server.listen(7777, () => { console.log('Server listening on port 7777') })
    backend.use(broker)

    // - Peer events
    backend.on('connection', function(socket) {
      this.clients.push(socket)

      socket.on('message', function(data) {
        console.log('[peer -> *]: %s', data);
        socket.broadcast.emit('message', data);
      })

      socket.broadcast.emit('message', 'Welcome ' + socket.toString())
    });
  }

  /**
   * Broadcast block information
   *
   * @param   Block   block   The block that we'll broadcast.
   * @return  any
   */
  public async broadcastBlock(
    block: Block,
  ): Promise<any> {
    // - Other peers will receive block hash information
    for (let i = 0, m = this.clients.length; i < m; i++) {
      this.clients[i].emit('message', block.blockHash)
    }

    return true
  }
}

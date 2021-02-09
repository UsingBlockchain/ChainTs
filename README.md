<p align="center"><img src="https://ubc.digital/wp-content/uploads/2021/02/ubc-logo-black-500x169-1.png" width="220"></p>

# UsingBlockchain/ChainTs

Repository for the `ChainTs` open source blockchain network. The kernel software is written with Typescript.

This package aims to provide with a **simplistic blockchain network** as showcased in [UBC Digital Magazine](https://ubc.digital).

*The author of this package cannot be held responsible for any loss of money or any malintentioned usage forms of this package. Please use this package with caution.*

Package licensed under [LGPLv3](LICENSE) License.

## Requirements

1. Latest NodeJS **stable** version (> v12)

```bash
$ node -v
v12.18.4
```

## Instructions / Environment

1. Clone the Project

```bash
git clone https://github.com/UsingBlockchain/ChainTs
```

2. Install the required dependencies.

```bash
cd ChainTs && npm install
```

3. Build

```bash
npm run build
```

## Examples

1. Create 5 blocks with hashes that hold a minimum of 3 leading zeros (few resources needed)

```bash
./chaints Miner --difficulty 3 --blocks 5
```

2. Create 2 blocks with hashes that hold a minimum of 10 leading zeros  (more resources needed)

```bash
./chaints Miner --difficulty 10 --blocks 2
```

## Donations / Pot de vin

Donations can also be made with cryptocurrencies and will be used for running the project!

    NEM:       NB72EM6TTSX72O47T3GQFL345AB5WYKIDODKPPYW
    Bitcoin:   3EVqgUqYFRYbf9RjhyjBgKXcEwAQxhaf6o

## Sponsor us

    Paypal:    https://paypal.me/usingblockchainltd
    Patreon:   https://patreon.com/usingblockchainltd
    Github:    https://github.com/sponsors/UsingBlockchain

## Credits

| Username | Role |
| --- | --- |
| [Using Blockchain Ltd](https://using-blockchain.org) | Product Owner |
| [eVias](https://github.com/evias) | Project Lead |

## License

This software is released under the [LGPLv3](LICENSE) License.

Copyright © 2021 Using Blockchain Ltd (https://using-blockchain.org), All rights reserved.


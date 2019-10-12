Ethereum Prism Smart Contract
==========

Ethereum Prism Smart Contract allows to earn **30% ETH**.

# Contract address 0x0d55eBbb67c2415f6038a41Effa710Bf1C1Bc63f

## How it's works? 
1. You send a certain amount to Smart Contract address.
2. When smart contract accumulates **130%** of the amount you've sent, you'll receive a transfer with income - **Amount you've deposited * 1.30**.
3. Transfers are arranged in the FIFO queue.

## How to use it?

Prism Smart Contract is deployed on Ethereum network. There are several transfer levels available: **[0.02, 0.05, 0.10, 0.50, 1.00, 2.00, 10.00]** ETH. Just send transaction to Smart Contract address and wait for the payment. Of course you can make many deposits. (eg. to check it's really works).

## Why it works?

Smart Contract is immutable! Nobody can change that! Moreover it's also open source and everyone can check how it works in deep. There is no possibility to prioritize withdraws.

## IMPORTANT NOTICE

Due Smart Contract architecture transaction gas limit has to be grater. I recommend to set to 250_000. Why? Smart Contract automatically sends funds to recipients and it costs gas. You pay gas for previous transaction, but someone else pay for Your transaction.

## Example

1. X deposits **1 ETH**
2. Y deposits **1 ETH**
3. Contract automatically sends **1.30 ETH** to **X**
4. Z deposits **1 ETH**
5. Contract automatically sends **1.30 ETH** to **Y**

Whats more You can process Your own transfer:

1. X deposits **1 ETH**
2. X deposits **1 ETH**
3. Contract automatically sends **1.30 ETH** to **X**

## Recommended

- node v10.16.0
- npm 6.9.0

## Tests
Rinkeby address:
**0x50b1474b6C9494d1c9ceefD57bD6c67AFB55cDE9**

* ```npm install```
* ```npm run start:ganache```
* ```npm run test:prism```

## NOTICE

1. Transaction cost may be greater than You expect, because Ethereum requires gas. It means that when You deposit 1 ETH the balance will be charged more than that (eg. 1.001 ETH).
2. New deposits pays income for old deposits. That means - Outcome transfers occur less frequently than deposits.
3. You cannot withdraw Your balance whenever You want. You have to wait for Your turn.
4. Contract charges 5% fee inside. Fee is accumulated like a balance.
5. Each level has independent queue. 
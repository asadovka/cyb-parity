# Cyb: web3 browser

## Contents:

1. Ovewview
2. Principles
3. Main page
4. Navigation bar (back, DURI, forward)
5. State bar (connectivity, web3 providers, sync state)
6. Id bar (choose account or id provider) + keystorage
7. Dapp bar (telegram or status like behavior) + dapp development
8. Signer () and tx queue ()
9. Root registry
10. Computation limitation (docker)
11. Permissions
12. Core apps
13. otifications

# 0. Overview

Cyb is a web3 browser with integrated DApp platform. You can read more about web3 [here](cyb/docs/web3-vision.md)
There are two main parts of browser:

1. Shell, which alows:

- search data in blockchains, Dapps, and process content via IPFS
- deploy and manage Dapps for users
- manage sync state of nodes: IPFS, Ethereum and Cyber
- manage user's account data (sign transactions, create custom feed)

2. DApps, which:

- provide full user experience in web3
- can be available through IPFS


# 1. Principles

We adhere to such key principles of cyb behavior, design and development.

## Respect users

We focus on developers and advanced blockchain and IPFS users. But cyb is also friendly for everyone who wants to interact with consensus computers.

## Anonimity

We respect user's attitudes and principles. So we offer 3 clear custom types of activity tracking. 

- public activity [user account address + events tracking]
- private activity [abstract ID + events tracking ]
- anonymous activity [no tracking at all]

By default all activity is anonymous. But for successful browser development we need to collect at least public and private data. Thus users of these 2 groups well be incentivized with tokens.

## Contribution

As an open source project we are welcome for contributions. 

## Donation mechanism

We have our vision of how to develop browser and what kind of fetures develop first. But we give an opportynity for community to decide and vote with tokens what kind of browser we need to see in near future. 

## Feeedback and bug collection

We use user's feedback to make products better. So we provide options for bug reporting and feedback leaving on every page.

## Design

Cyb design process follows Web3 design principles.

### 2.1. State rules

We use simple colored states for states of transactions or operations:

- mempool/failed - red
- confirmed/reverted - yellow
- finalized/succesful - green

### 2.2 Data visualisation

Data should be visualised in a simple and attractive way. No overloaded plots an diagrams, we use animation instead.

### 2.3 Blockchain objects presenting

Blockchain data is too complicated and sometimes not obvious for people. Thus we use adaptive tricks to make work process more convenient:

1. Logical grouping for objects. Every app page has common groups of data (general, blockchain specific) for inheritance of views and better navigation or data observing.
2. Classical accounting terms used for balance and cashflow operations. Blockahains use econimic principles for interaction between subjects thus we can describe such processes in established terms.
3. Robohash logo for contracts entities. Contracts can act by themself, have and algorithms, so it's more natural to perceive them like robots instead of pieces of code.


## 3. Development

## 3.1 Shell development

## 3.2 DApps development

## 3.3 DApps deployment

## 3.4 DApps interaction

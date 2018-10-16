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
13. Notifications

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


# Main Page

Main page of the browser consists of three main parts:

- search bar, that provides all search functions
- "most use" tabs, which are based on popular account activity and are unique for every account
- links of Congress' products, which are useful to contributors

# Navigation bar

In web3 all data has a definite state, so it become easier to navigate through it and make UX better.  

Navigation bar in Cyb is based on such elements as:

- back button - returns user to the previous state of web3 agent
- DURA section - provides easy access to certain state of web3 agent
- forward button - brings user to the future state

As a knowledge graph, (cyberd)[cyberd doc] can analyze user's activity and make predictions of user behavior. Thus we can implement the "forward" button.

# Stat bar

To be sure that you are working with actual state browser needs to manage connection to web3 providers.

Currently we use Ethereum, IPFS, and Cyber nodes. Browser can show sync state with that nodes, display connection state (local, remote, no connection) and give an ability for user to chose own web3 provider.

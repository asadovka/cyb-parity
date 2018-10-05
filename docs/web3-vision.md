# A vision for web3
@xhipster @asadovka

## Introduction
... Problematics 

Currently the Internet is in crisis. Prevailing web2 paradigm causes technical, economic and social problems: 

1. Internet is still wery slow. Client - server architecture has a single point of failure and provides a long way to transfer data. Telecommunication equipment is utilized not effectively.
2. There is no way for users to own, control and transfer data securely. Big Internet providers can fully track user's activity and use or compromise it without user's agreement. 
3. Web2 paradigm causes monopolization of market. Big tech companies and internet providers have significant share in computing powers, human capital and money capital. Every year theese shares become bigger and bigger which gives no chance for alternative solutions to compete on the market.
4. No permanent data. Data in web2 paradigm is stateless and become unacsessable or lost during time. Old links with high probability leads to nowhere.

This leads up to conclusion of what kind of characteristics the new Internet (web3) will have:

1. Fast data transfer
2. Global connection
3. Secure
4. Private/Anonymous
5. Permanent state
6. Ability to work offline
7. Real-time connection update
8. Economy




## Web2: Where => what-how

Instead of location based paradigm is based on content addressing paradigm. Key point is that we do not need to have knowledge of location such as domain name in order to link to an object

## Web3: What => How

Register with simple map between input and hash of an app. If no input return self

Keyword:
- . is the thing

Examples:
- cybernode.ai
- 689jfcnffk8trcvhhjnjhgv.ethtx
- cybernode.eth

New approach for paths in web3:
- local file paths ~~versus~~ are global paths. Merge filesystem paths and internet paths
- thinking how to get resource, not where. file extensions and 1 level tlds are the same things
- right segment explains how to parse left segment. Maps in chaingear.

## DURA

Distributed Unified Resource Address

[local-handler]://[content-address].[root-registry-name]//[app-navigation]

## Local handler
cyb:// - is local handler that every os can handle. Being fully optional it can be very important in the very begining of web3
The most important part in this expression is the dot

## Content address
```
cyb://QmQLXHs7K98JNQdWrBB2cQLJahPhmupbDjRuH1b9ibmwVa.ipfs//files/explorer
```

## Root registry

Current state of DNS root management is outdated. The most bad thing is that we still must to trust the most important things in our lives to strange organizations such as ICANN, IANA

...Our proposal is that different browser software can choose

We can ask ourselves why after 40 years of ubiquitous computer moment we are still don't have simple common knowledge about what file extensions must be used with what software?

Our proposal is a concept of a root register. Structure of root register is a simple map between short name and ipfs hash of a program that is being triggered:

```
com:QmQLXHs7K98JNQdWrBB2cQLJahPhmupbDjRuH1b9ibmwVa google.com
io:QmQLXHs7K98JNQdWrBB2cQLJahPhmupbDjRuH1b9ibmwVa
exe:QmQLXHs7K98JNQdWrBB2cQLJahPhmupbDjRuH1b9ibmwVa
pdf:QmQLXHs7K98JNQdWrBB2cQLJahPhmupbDjRuH1b9ibmwVa
```
A name must be letter, number or hypen


Purpose of root register is to reach some very basic os and network agnostic agreement about what extensions with what programs must be used. Of corse the problem with such registry is that it must be somehow and somewhere maintained.

## Three rules of root registry
1. Software vendors must compete for a better root registry
2. Software vendors must add setting with a change of a root registry
3. Users of browsers and operation systems must have ability to overwrite maps

On of the implementation is a [cyb](QmQLXHs7K98JNQdWrBB2cQLJahPhmupbDjRuH1b9ibmwVa.md) root registry

## App navigation

## Extensions

A lot of cool stuff can be implemented using extensions. Extension is any symbol that adds predictable an logical behavior for parsing and rendering of requests.

Examples:
- local paths
- connection links
- CID stuff
- URL parameters

Key principle is that semantics is programmable and can be delivered from distributed network

## Where extension

Keyword:
- under / left part is local path

Examples:
/https/cybernode.ai
/ethereum/cybersearch.et

Need to extend global paths to local paths

- under right is state

# Link extension

Keyword:
- at @

Keyword:

Examples:
xhipster.eth@cybetfund.ai

Need to find link between two entries

:// Expression which allow address something for independent app

## Reference

https://tools.ietf.org/search/rfc6454
http://127.0.0.1:8080/ipfs/QmR7GSQM93Cx5eAg6a6yRzNde1FQv7uL6X1o4k7zrJa3LX/ipfs.draft3.pdf
Not good

https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki

ERC 190 Package manager

https://github.com/ethpm/ethpm-spec/blob/v1.0.0/release-lockfile.spec.md

https://github.com/ethereum/EIPs/issues/190


http://gavwood.com/web3lt.html

## On censorship resistance
    - writing data (medium, EOS)
    - reading data (gitcoin)

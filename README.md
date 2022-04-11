# One Time Shiritori

*Shiritori Game with Ethereum Contracts*

**BE CAREFUL. This program is intended to run on a PRIVATE network.**

![overview](https://user-images.githubusercontent.com/24666428/162844709-857e81f3-59a9-4a2f-b89e-3d3640ce03e3.png)

### Dependency

- Make command
- [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/ "metamask")
    - **Handle Wallet with care!**
- [Node](https://nodejs.org "node")
- [Ganache](https://trufflesuite.com/ganache/ "ganache")
- [Truffle command](https://trufflesuite.com/docs/truffle/getting-started/installation/ "truffle")

### Run
1. Launch Ganache Server on localhost:8545
    - default port is 7545. so change it.
2. Connect localhost:8545 network with metamask
    - you can select this networkon metamask setting.
3. Execute the following commands
```bash
$ git clone https://github.com/TakuKitamura/one-time-shiritori
$ cd one-time-shiritori
$ npm install
$ make clean-deploy-to-dev
$ cd client
$ npm install
$ npm start
$ # open http://localhost:3000 on your browser
$ # and wallet to shiritori with MetaMask
$ # let's play siritori
```

### Test

```bash
$ cd one-time-shiritori
$ make test
```
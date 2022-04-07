import React, { Component } from "react";
import GreeterContract from "./contracts/Shiritori.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { history: [123], inputWord:'', web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GreeterContract.networks[networkId];
      const instance = new web3.eth.Contract(
        GreeterContract.abi,
        deployedNetwork && deployedNetwork.address,
      );



      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({  web3, accounts, contract: instance }, this.setShiritoriHisory);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  setShiritoriHisory = async () => {
    const { accounts, contract } = this.state;
    const history = await contract.methods.getHistory().call()
    this.setState({history: history})
    console.log(contract.events);
    contract.events.allEvents({}, (err, event) => {
        console.log(`event called: ${event.event}`);
        console.log(JSON.stringify(event, null, "    "));
    });
  };

  handleGreetingChange = (e) => {
    const inputVal = e.target.value
    this.setState({ inputWord: inputVal })
  }

  formSubmitHandler = async (e) => {
    e.preventDefault();
    const { accounts, contract, word } = this.state;
    // console.log(accounts, contract, word, contract.methods.setGreeting)

    const history = await contract.methods.getHistory().call()
    if (history.length === 0){
        const updatedWord = await contract.methods.setFirstWord(word).send({from: accounts[0]});
        const history = await contract.methods.getHistory().call()
        this.setState({ history: history })
        
    } else {
        const updatedWord = await contract.methods.sayNextWord(word).send({from: accounts[0]});
        const history = await contract.methods.getHistory().call()
        this.setState({ history: history })
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>しりとり</h1>
          {this.state.history.map((data) => {
            return <span>{data} → </span>;
        })}{this.state.inputWord}
        <form>
          <label>
            <input type="text" onChange={e => this.handleGreetingChange(e)} />
            <button onClick={this.formSubmitHandler}> 単語を言う </button>
          </label>
        </form>
      </div>
    );
  }
}

export default App;

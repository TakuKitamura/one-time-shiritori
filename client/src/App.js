import React, { Component } from "react";
import GreeterContract from "./contracts/Shiritori.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { greeting: '', word: [], web3: null, accounts: null, contract: null };

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
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    console.log(contract.events);
    contract.events.allEvents({}, (err, event) => {
        console.log(`event called: ${event.event}`);
        console.log(JSON.stringify(event, null, "    "));
    });
    // const response = await contract.methods.getHistory().call()

    // this.setState({ greeting: response });
  };

  handleGreetingChange = (e) => {
    const inputVal = e.target.value
    this.setState({ greeting: inputVal })
  }

  formSubmitHandler = async (e) => {
    e.preventDefault();
    const { accounts, contract, greeting } = this.state;
    // console.log(accounts, contract, greeting, contract.methods.setGreeting)

    const history = await contract.methods.getHistory().call()
    if (history.length === 0){
        const updatedWord = await contract.methods.setFirstWord(greeting).send({from: accounts[0]});
        const history = await contract.methods.getHistory().call()
        this.setState({ word: history })
        
    } else {
        const updatedWord = await contract.methods.sayNextWord(greeting).send({from: accounts[0]});
        const history = await contract.methods.getHistory().call()
        this.setState({ word: history })
    }
  }

   getHistory = async (e) => {
    e.preventDefault();
    const { accounts, contract, greeting } = this.state;
    // console.log(accounts, contract, greeting, contract.methods.getHistory)
    const history = await contract.methods.getHistory().call()
    this.setState({ word: history });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>しりとり</h1>

        <form>
          <label>
            <input type="text" value={this.state.greeting} onChange={e => this.handleGreetingChange(e)} />
            <button onClick={this.formSubmitHandler}> 単語を言う </button>
            <button onClick={this.getHistory}>しりとり履歴</button>
            {this.state.word}
          </label>
        </form>



      </div>
    );
  }
}

export default App;

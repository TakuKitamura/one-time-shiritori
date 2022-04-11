import React, { Component } from "react";
import GreeterContract from "./contracts/Shiritori.json";
import getWeb3 from "./utils/getWeb3";
import overview from './overview.jpg';


import "./App.css";

class App extends Component {
  state = { history: [], inputWord:'', isGameOver: false, web3: null, accounts: null, contract: null };

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
    }
  };

  getGameOverStatus = async () => {
    const { contract } = this.state;
    const isGameOver = await contract.methods.getGameOverStatus().call();
    this.setState({isGameOver: isGameOver})
    return isGameOver
  }

  setShiritoriHisory = async () => {
    const { contract } = this.state;
    const history = await contract.methods.getHistory().call()
    const isGameOver = await this.getGameOverStatus()
    this.setState({history: history, isGameOver: isGameOver})

    // receive nextTurnEvent
    contract.events.NextTurnEvent({}, (err, event) => {
        this.setState({history: event['returnValues']['word'], inputWord:''})
    });
  };

  handleGreetingChange = (e) => {
    const inputVal = e.target.value
    this.setState({ inputWord: inputVal })
  }

  formSubmitHandler = async (e) => {
    e.preventDefault();
    const { accounts, contract, inputWord } = this.state;
    const history = await contract.methods.getHistory().call()

    // set new word
    if (history.length === 0){
        await contract.methods.setFirstWord(inputWord).send({from: accounts[0]});
    } else { // set next word
        await contract.methods.sayNextWord(inputWord).send({from: accounts[0]})
    }

    const isGameOver = await this.getGameOverStatus()
    this.setState({isGameOver: isGameOver})
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <img width="70%" src={overview} alt="overview" />
        <p>
        
        Player: {
        // connected wallet address 
        this.state.accounts
        }
        </p>
        <h2>
          {this.state.history.map((data) => {
            // shiritori history
            return <span key={data}>{data} → </span>;
        })}
        {
            // game over status
            this.state.isGameOver ? <span>Game Over</span> : <span>{this.state.inputWord}</span>
        }
        </h2>
        <form>
            <input type="text" value={this.state.inputWord} onChange={e => this.handleGreetingChange(e)} />
            <button onClick={this.formSubmitHandler}> 単語を言う </button>
        </form>
      </div>

    );
  }
}

export default App;

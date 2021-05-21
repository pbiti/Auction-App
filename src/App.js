import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

//bid_input: the input value the current address wants to bid

class App extends Component {
  state = { web3: null, accounts: null, contract: null, bid_input: null, highestbid: null, highestbidder: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      /*check for the highest bid and bidder and print it
      *******************************************************************************/
      const highest_bid = await instance.methods.highestBid().call();
    
      const highest_bidder = await await instance.methods.highestBidder().call();
    
      this.setState({ highestbid: highest_bid, highestbidder: highest_bidder });
      /*******************************************************************************/
      
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid = async () => {
    const { accounts, contract } = this.state;
    
    //bid the input value from current account
    await contract.methods.bid().send({from: accounts[0] , value: this.state.bid_input});
    
    //store the current highest bid
    const highest_bid = await contract.methods.highestBid().call();
    
    //store current highest bidder
    const highest_bidder = await await contract.methods.highestBidder().call();
    
    //update the state variables
    this.setState({ highestbid: highest_bid, highestbidder: highest_bidder });

   };
   
   withdraw = async () => {
    const { accounts, contract } = this.state;
    
    //bid the input value from current account
    await contract.methods.withdraw().send({from: accounts[0]});
    
    //store the current highest bid
    const highest_bid = await contract.methods.highestBid().call();
    
    //store current highest bidder
    const highest_bidder = await await contract.methods.highestBidder().call();
    
    //update the state variables
    this.setState({ highestbid: highest_bid, highestbidder: highest_bidder});

   };
   
    
  ChangeBid = (event) => {
      this.setState({bid_input: event.target.value}, () => {
    });
  }
  
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Auction</h1>
        
        <h3>Bid:</h3>
        <div><input type="number" placeholder="Value you would like to bid" onChange={this.ChangeBid} />
        
        <button onClick = {this.bid}>Bid</button></div>
        
        <h3>Withdraw:</h3>
        <div><button onClick = {this.withdraw}>Withdraw</button></div>
        
        <h3>Auction Info:</h3>
        <div>Current highest bid:<b>{this.state.highestbid}</b></div>
        <div>Current highest bidder:<b>{this.state.highestbidder}</b></div>
      </div>
    );
  }
}

export default App;

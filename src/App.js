import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { useState, useEffect } from 'react';

function App() {
  const [manager, setManager] = useState(null);
  const [numPlayers, setNumPlayers] = useState(0);
  const [balance, setBalance] = useState(0);
  const [etherInput, setEtherInput] = useState(0);
  const [txState, setTxState] = useState(null);

  useEffect(() => {
    async function fetchManager() {
      let response = await lottery.methods.manager().call();
      setManager(response);
      let res = await lottery.methods.getPlayers().call()
      setNumPlayers(res.length);
      let resbal = await web3.eth.getBalance(lottery.options.address);
      setBalance(web3.utils.fromWei(resbal, 'ether'));
    }
    fetchManager()
  }, []);

  const handleInputChange = (e) => {
    e.preventDefault();
    setEtherInput(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();


    const addressArray = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(addressArray);
    setTxState('Sending the transaction to the network')
    const tempNum = web3.utils.toWei(etherInput, 'ether')
    await lottery.methods.enterLottery().send({
      from : addressArray[0],
      value : tempNum
    })
    setTxState('Successfully entered into the lottery')
  }

  const pickWinner = async() => {
    const accounts = await window.ethereum.request({ method : 'eth_requestAccounts'});
    setTxState('Sending the transaction to the network')
    await lottery.methods.pickWinner().send({
      from : accounts[0]
    });
    setTxState('Winner has been picked!!');
  }
  return (
    <div>
      hello!
      mr. 
      <p>{manager}</p>
      There are currently  
      <h4>{numPlayers}</h4>
      playing the game. and the contract currently has
      <h3>{balance}</h3>
       ether balance in it
       <form onSubmit={handleSubmit}>
        Amount of ether to enter : <input onChange={handleInputChange} />ether {`\n`}
        
        <button>enter Lottery</button>
       </form>
       <hr />
       <h3>Ready to pick a winner?</h3>
       <button onClick={pickWinner}>Pick a Winner</button>
       <hr />
       <h4>{txState}</h4>
    </div>
  );
}

export default App;

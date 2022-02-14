import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/MyToken.json";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputValue, setInputValue] = useState({ walletAddress: "", transferAmount: "", burnAmount: "", mintAmount: "" });
  const [tokenName, setTokenName] = useState("My Token");
  const [tokenDescription, setTokenDescription] = useState("Welcome to The My Token.We rise together. We build together. We grow together.");
  const [tokenOwner, setTokenOwner] = useState("aromamoon");
  const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState(null);
  const [yourWalletAddress, setYourWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = '0x8d46aba6749c45f28a65319ee4f8e9e0604263e5';
  const contractABI = abi.abi;

  const getTokenInfo = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        let tokenName = await tokenContract.name();
        let tokenDescription = await tokenContract.description();
        let tokenOwner = await tokenContract.owner();
        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = utils.formatEther(tokenSupply)

        setTokenName(`${tokenName} 🦊`);
        setTokenDescription(tokenDescription);
        setTokenOwner(tokenOwner);
        setTokenTotalSupply(tokenSupply);
        setTokenOwnerAddress(tokenOwner);

        if (account.toLowerCase() === tokenOwner.toLowerCase()) {
          setIsTokenOwner(true)
        }

        console.log("Token Name: ", tokenName);
        console.log("Token Description: ", tokenDescription);
        console.log("Token Owner: ", tokenOwner);
        console.log("Token Supply: ", tokenSupply);
        console.log("Token Owner: ", tokenOwner);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const transferToken = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await tokenContract.transfer(inputValue.walletAddress, utils.parseEther(inputValue.transferAmount));
        console.log("Transfering tokens...");
        await txn.wait();
        console.log("Tokens Transfered", txn.hash);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="main-container">
      <h2 className="headline">
        <span className="headline-gradient">My Project 3: Final Project</span>
      </h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
          <div class="container">
            <div class="row">
              <div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <img src='https://d1iczm3wxxz9zd.cloudfront.net/cf448ac5-9078-44a9-b8a9-6d85175c1af8/000000-0000000002/27100030241167471445704004800716370922650091160041098576044089597982141802867/ITEM_PREVIEW1.png'></img>
              </div>
              <div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div class="tokeninfo">
                  <div class="tokentitle">
                    <span className="mr-5"><strong>Coin:</strong><span class="tokenname"> {tokenName} </span></span>
                  </div>
                  <div class="tokenowner">
                    <div class="row">
                      <div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                        <span className="mr-5"><strong>Owner:</strong><span class="tokenowners"> {tokenOwner} </span></span>
                      </div>
                      <div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                        <span className="mr-5"><strong>Token:</strong><span class="tokenowners"> {tokenName} </span></span>
                      </div>
                    </div>
                  </div>
                  <div class="tokenlink">
                    <div class="form-group mb-2 ml-2">
                      <a class="btn btn-success index-add btn-add" href="https://rinkeby.etherscan.io/address/0x8d46aba6749c45f28a65319ee4f8e9e0604263e5" target="_blank">Link to Rinkeby</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">  
              <div class="tokendescription">
                <div class="tokendescriptions">
                  <span className="mr-5"><strong>Description:</strong><span class="tokendesc"> {tokenDescription} </span></span>
                </div>
              </div>  
            </div>
          </div>

        </div>
      </section>
    
      </main>
  );
}
export default App;

// NftUploader.jsx
import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from 'react'
import ImageLogo from "./image.svg";
import "./NftUploader.css";
// NftUploader.jsx
import { ethers } from "ethers";
import Web3Mint from "../../utils/Web3Mint.json";
import { Web3Storage } from 'web3.storage'



const NftUploader = () => {
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  const connectWallet = async () =>{
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエストしています。
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付けます。
       */
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // NftUploader.jsx
const askContractToMintNft = async (ipfs) => {
  const CONTRACT_ADDRESS =
    "0xe565F8Aa610440859939C97384245244E4277e7D";
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Web3Mint.abi,
        signer
      );
      console.log("Going to pop wallet now to pay gas...");
      //本来はここの値に関して。フロントからの入力値が入る
      let name = "my work"
      let prompt = "japanese temple in the winter"
      let seed = "1234567"
      let height = "512"
      let width = "512"
      //
      let nftTxn = await connectedContract.mintIpfsNFT(name,prompt,ipfs,seed,height,width);
      console.log("Mining...please wait.");
      await nftTxn.wait();
      console.log(
        `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
      );
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

// NftUploader.jsx
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVlRjkzOEMxZDgxYjZkODk1YzBBNjlEQjJiYmMzRkFDNTIyMDYxMUMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUzNjcxNDU1MTAsIm5hbWUiOiJVTkNIQUlOIn0.pT0uSDyETOz8xyCpXPnX1T4w6rmkeekwTckJVcJsHsk"
const imageToNFT = async (e) => {
  const client = new Web3Storage({ token: API_KEY })
  const image = e.target
  console.log(image)

  const rootCid = await client.put(image.files, {
      name: 'experiment',
      maxRetries: 3
  })
  const res = await client.get(rootCid) // Web3Response
  const files = await res.files() // Web3File[]
  for (const file of files) {
    console.log("file.cid:",file.cid)
    askContractToMintNft(file.cid)
  }
}




  const renderNotConnectedContainer = () => (
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>
    );
  /*
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="outerBox">
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        <p>If you choose image, you can mint your NFT</p>
      )}
      <div className="title">
        <h2>NFTアップローダー</h2>
      </div>
      <div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div>
        <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT} />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT}/>
      </Button>
    </div>
  );
};

export default NftUploader;
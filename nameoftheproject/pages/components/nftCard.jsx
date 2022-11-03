
import { Network, Alchemy } from "alchemy-sdk";


export const NFTCard = ({ nft }) => {
    // const settings = {
    //     apiKey: "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM", // Replace with your Alchemy API Key.
    //     network: Network.ETH_GOERLI, // Replace with your network.
    //   };
      
    //   const alchemy = new Alchemy(settings);
      
    //   // Print total NFT count returned in the response:
    //   const owneraddress = alchemy.nft.getOwnersForNft(nft.contract.address, nft.id.tokenId);
    //   console.log(owneraddress.owners);

    var requestOptions = {
        method: 'GET'
      };
      const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM"
      const baseURL = `https://eth-goerli.g.alchemy.com/v2/${api_key}/getOwnersForToken/`;
      const fetchURL = `${baseURL}?contractAddress=${nft.contract.address}&tokenId=${nft.id.tokenId}`;
      const owneraddress =  fetch(fetchURL, requestOptions).then(console.log);


    return (
        <div className="w-1/4 flex flex-col ">
        <div className="rounded-md">
            <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
        </div>
        <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
            <div className="">
                <h2 className="text-xl text-gray-800">{nft.title}</h2>
                <p className="text-gray-600" >NFT Contract Address : {nft.contract.address}</p>
              <p className="text-gray-600" >Owner Addresss : {owneraddress.owners}</p>  
            </div>


            <div className="flex-grow mt-2">
                <p className="text-gray-600">Prompt : {nft.description}</p>
            </div>
        </div>

    </div>
    )
}
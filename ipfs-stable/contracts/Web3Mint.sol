// Web3Mint.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//OpenZeppelinが提供するヘルパー機能をインポートします。
import "@openzeppelin/contracts/utils/Counters.sol";

//SBT用
import "./libraries/Base64.sol";
import "hardhat/console.sol";

//生成されたNFTの必要情報
contract Web3Mint is ERC721{
    struct NftAttributes{
        string  name;
        string  imageURL;
        string  description;
        string  seed;
        string height;
        string width;
        string guidance_scale;
        string steps;

    }

    NftAttributes[] Web3Nfts;

    using Counters for Counters.Counter;
    // tokenIdはNFTの一意な識別子で、0, 1, 2, .. N のように付与されます。
    Counters.Counter private _tokenIds;

    constructor() ERC721("PromptWizards'Guild","PWG"){
        console.log("This is my NFT contract.");
    }

    // ユーザーが NFT を取得するために実行する関数です。

    function mintIpfsNFT(string memory name , string memory description, string memory imageURI,string memory seed,string memory height,string memory width,string memory guidance_scale,string memory steps ) public{
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender,newItemId);
        Web3Nfts.push(NftAttributes({
            name: name,
            imageURL: imageURI,
            description : description,
            seed : seed,
            height : height,
            width : width,
            guidance_scale : guidance_scale,
            steps : steps
        }));
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        _tokenIds.increment();
    }
    function tokenURI(uint256 _tokenId) public override view returns(string memory){
    string memory json = Base64.encode(

        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    Web3Nfts[_tokenId].name,
                    ' -- NFT #: ',
                    Strings.toString(_tokenId),
                    '", "description": "',Web3Nfts[_tokenId].description,'", "image": "ipfs://',
                    Web3Nfts[_tokenId].imageURL,'","attributes" : [ {"trait_type": "seed", "value" : "',Web3Nfts[_tokenId].seed,'"},{"trait_type": "height", "value" : "',Web3Nfts[_tokenId].height,'"},{"trait_type": "width", "value" : "',Web3Nfts[_tokenId].width,'"},{"trait_type": "guidance_scale", "value" : "',Web3Nfts[_tokenId].guidance_scale,'"},{"trait_type": "steps", "value" : "',Web3Nfts[_tokenId].steps,'"}]}'
                )
            )
        )


    );


    
    string memory output = string(
        abi.encodePacked("data:application/json;base64,", json)
    );
    return output;
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721) {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721) {
        require(from == address(0), "Err: token is SOUL BOUND");
        super._beforeTokenTransfer(from, to, tokenId);
    }

}

    


//     function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
//         return string(abi.encodePacked("https://example.com/", tokenId.toString(), ".json"));
//     }
// }
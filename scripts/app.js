
import { contractAddress, contractAbi } from "./contract.js";

let provider;
let contract;
let walletAddress;

export async function connectMetamask() {
    console.log("Connecting...");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());
      const accounts = await provider.listAccounts();
      const chainId = await provider.getNetwork().chainId;
      walletAddress = accounts[0];
      document.getElementById("connectButton").innerHTML = `${walletAddress.substring(0, 7)}...`;
      console.log('Connected! ', walletAddress)
      return walletAddress;
    } catch (error) {
      console.error(error);
    }
}

export async function showOwnedTokens(walletAddress, itemsPerRow) {
    console.log(walletAddress);
    try {
      const tokens = await contract.getOwnedTokenIds(walletAddress);
      const tokenDiv = document.getElementById("tokensContainer");
      tokenDiv.innerHTML = ""; // clear any previous tokens
    console.log("working");
      for (const tokenId of tokens) {
        const tokenUri = await contract.tokenURI(tokenId);
        const data = tokenUri.split(",");
        const decodedTokenUri = atob(data[1]);
        console.log(decodedTokenUri);
        const tokenData = decodedTokenUri.split('"');
        console.log(tokenData);
  
        // Create a container for the token
        const tokenContainer = document.createElement("div");
        tokenContainer.classList.add("token");
  
        // Create an anchor element for the token image with the link URL
        const linkElement = document.createElement("a");
        linkElement.href = 'https://opensea.io/assets/ethereum/' + contractAddress + '/' + tokenId;
  
        // Create an image element for the token
        const imageElement = document.createElement("img");
        imageElement.src = tokenData[7];
        linkElement.appendChild(imageElement);
        tokenContainer.appendChild(linkElement);
  
        // Create a heading element for the token name
        const nameElement = document.createElement("h2");
        nameElement.textContent = tokenData[3];
        tokenContainer.appendChild(nameElement);
  
        // Create an unordered list for the token attributes
        const attributesList = document.createElement("ul");
  
        let attributeItem = document.createElement("li");
        attributeItem.textContent = `Digits: ${tokenData[17]}`;
        attributesList.appendChild(attributeItem);
        attributeItem = document.createElement("li");
        attributeItem.textContent = `Check: ${tokenData[25]}`;
        attributesList.appendChild(attributeItem);
  
        tokenContainer.appendChild(attributesList);
  
        // Add the token container to the tokens container
        tokenDiv.appendChild(tokenContainer);
      }
    } catch (error) {
      console.error(error);
    }
  } 

  export async function getImage() {
    const tokenUri = await contract.tokenURI(contract.totalSupply());
    console.log(tokenUri);
    const data = tokenUri.split(",");
    const decodedTokenUri = atob(data[1]);
    console.log(decodedTokenUri);
    const tokenData = decodedTokenUri.split('"');
    console.log(tokenData);
  
    // Create a container for the token
    const tokenContainer = document.createElement("div");
    tokenContainer.classList.add("token");
  
    // Create an image element for the token
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    const imageElement = document.createElement("img");
    imageElement.src = tokenData[7];
    imageContainer.appendChild(imageElement);
  
    // Create a container for the attributes
    const attributesContainer = document.createElement("div");
    attributesContainer.classList.add("attributes-container");
  
    const attributesList = document.createElement("ul");
  
    let attributeItem = document.createElement("li");
    attributeItem.textContent = `${tokenData[13]}: ${tokenData[17]}`;
    attributesList.appendChild(attributeItem);
    attributeItem = document.createElement("li");
    attributeItem.textContent = `${tokenData[21]}: ${tokenData[25]}`;
    attributesList.appendChild(attributeItem);
  
    attributesContainer.appendChild(attributesList);
  
    tokenContainer.appendChild(imageContainer);
    tokenContainer.appendChild(attributesContainer);
  
    document.body.appendChild(tokenContainer);
  }

  export async function getLeaders() {
    try {
      console.log("Getting Leaders");
      const uniqueOwners = {};
      let uniqueOwnersCount = 0;
      let totalSupply = await contract.totalSupply();
      console.log("Getting Leaders");
      for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
        
        const owner = await contract.ownerOf(tokenId);
        console.log(owner);
        if (!uniqueOwners[owner]) {
          const balance = await provider.getBalance(owner);
          uniqueOwners[owner] = { balance };
          uniqueOwnersCount++;
          console.log('Unique!');
  

        }
      }
  
      const leaderList = Object.keys(uniqueOwners).map(owner => ({
        owner,
        balance: uniqueOwners[owner].balance,
      }));
  
      const sortedLeaders = leaderList.sort((a, b) => b.balance - a.balance);
      const topLeaders = sortedLeaders.slice(0, 9).map(leader => ({...leader, tokens: []}));
      console.log(topLeaders);
      // Create a container for the leader
      const tokenDiv = document.getElementById("tokensContainer");
      
      for (let i = 0; i < 9; i++) {
        let tokens = await contract.getOwnedTokenIds(topLeaders[i].owner)
        console.log(tokens);
        
        
        const leaderContainer = document.createElement("div");
        leaderContainer.classList.add("leader");
  
        // Create a heading element for the leader name
        const leaderName = document.createElement("h2");
        // const reverseName = await provider.lookupAddress(topLeaders[i].owner);
        // if (reverseName != null){
        //   leaderName = reverseName;
        // }
        leaderName.textContent = "#" + (i+1) + " " + topLeaders[i].owner;

        leaderContainer.appendChild(leaderName);
  
        for (let j = 0; j < 5 && j < tokens.length; j++) {
            
            const tokenUri = await contract.tokenURI(tokens[j]);
            const data = tokenUri.split(",");
            const decodedTokenUri = atob(data[1]);
            console.log(decodedTokenUri);
            const tokenData = decodedTokenUri.split('"');
  
            // Create a container for the token
            const tokenContainer = document.createElement("div");
            tokenContainer.classList.add("token");
  
            // Create an anchor element for the token image with the link URL
            const linkElement = document.createElement("a");
            linkElement.href = 'https://opensea.io/assets/ethereum/' + contractAddress + '/' + tokens[j];
  
            // Create an image element for the token
            const imageElement = document.createElement("img");
            imageElement.src = tokenData[7];
            linkElement.appendChild(imageElement);
            tokenContainer.appendChild(linkElement);
  
            // Create a heading element for the token name
            const nameElement = document.createElement("h2");
            nameElement.textContent = tokenData[3];
            tokenContainer.appendChild(nameElement);
  
            // Create an unordered list for the token attributes
            const attributesList = document.createElement("ul");
  
            let attributeItem = document.createElement("li");
            attributeItem.textContent = `Digits: ${tokenData[17]}`;
            attributesList.appendChild(attributeItem);
            attributeItem = document.createElement("li");
            attributeItem.textContent = `Check: ${tokenData[25]}`;
            attributesList.appendChild(attributeItem);
  
            tokenContainer.appendChild(attributesList);
  
            // Add the token container to the leader container
            leaderContainer.appendChild(tokenContainer);
            
            
        }
        
        
        // Add the leader container to the tokens container
        tokenDiv.appendChild(leaderContainer);
      }
    } catch (error) {
      console.error(error);
    }
  }

        

  export async function showAllTokens(itemsPerRow) {
    try {
      const totalSupply = await contract.totalSupply();
      const tokenDiv = document.getElementById("tokensContainer");
  
      for (let tokenId = 1; tokenId <= 100; tokenId++) {
        const tokenUri = await contract.tokenURI(tokenId);
        const data = tokenUri.split(",");
        const decodedTokenUri = atob(data[1]);
        const tokenData = decodedTokenUri.split('"');
  
        // Retrieve the token link URL from the tokenURI metadata
        const linkUrl = tokenData[5];
  
        // Create a container for the token
        const tokenContainer = document.createElement("div");
        tokenContainer.classList.add("token");
        
        // Create an anchor element for the token image with the link URL
        const linkElement = document.createElement("a");
        linkElement.href = 'https://opensea.io/assets/ethereum/' + contractAddress + '/' + tokenId;
  
        // Create an image element for the token
        const imageElement = document.createElement("img");
        imageElement.src = tokenData[7];
        linkElement.appendChild(imageElement);
        tokenContainer.appendChild(linkElement);
  
        // Create a heading element for the token name
        const nameElement = document.createElement("h2");
        nameElement.textContent = tokenData[3];
        tokenContainer.appendChild(nameElement);
  
        // Create an unordered list for the token attributes
        const attributesList = document.createElement("ul");
  
        let attributeItem = document.createElement("li");
        attributeItem.textContent = `Digits: ${tokenData[17]}`;
        attributesList.appendChild(attributeItem);
        attributeItem = document.createElement("li");
        attributeItem.textContent = `Check: ${tokenData[25]}`;
        attributesList.appendChild(attributeItem);
  
        tokenContainer.appendChild(attributesList);
  
        // Add the token container to the tokens container
        tokenDiv.appendChild(tokenContainer);
      }
    } catch (error) {
      console.error(error);
    }
  } 
  

export async function increment() {
    console.log("up 1")
    const quantityInput = document.getElementById("quantity");
    const amount = document.getElementById("amount");
    let quantity = parseInt(quantityInput.innerHTML);
    if (quantity < 5) {
      quantity++;
      quantityInput.innerHTML = quantity;
      amount.innerHTML = quantity*0.002;
      console.log(quantity*0.002);
    }
}
  
export async function decrement() {
    console.log("down 1")
    const quantityInput = document.getElementById("quantity");
    const amount = document.getElementById("amount");
    let quantity = parseInt(quantityInput.innerHTML);
    if (quantity > 0) {
      quantity--;
      quantityInput.innerHTML = quantity;
      amount.innerHTML = quantity*0.002;
      console.log(quantity*0.002);
    }
}


export async function mintToken() {
  try {
    const paymentValue = document.getElementById("amount").textContent.trim();
    const tx = await contract.mint(document.getElementById("quantity").innerHTML, { gasLimit: 6721975, value: ethers.utils.parseEther(paymentValue) });
    console.log('Tokens minted successfully!', tx);

    const receipt = await tx.wait(); // wait for transaction confirmation and get the receipt

    console.log('Transaction confirmed!', receipt);
    window.location.href = "mytokens.html";

  } catch (error) {
    console.error(error);
  }
}



//document.getElementById("connectButton").addEventListener("click", connectMetamask);
// document.getElementById("mintButton").addEventListener("click", mintToken);
// document.getElementById("increment").addEventListener("click", increment);
// document.getElementById("decrement").addEventListener("click", decrement);
```
MINT_CONTRACT_ADDRESS=0x3f81cc88109d7f27bb82ddb1eabf2d06b7d3655a

HEROES_NFT_ADDRESS=0x618ebe52d73a482997a3d27b66d76e2133279a46
DL_HEROES_NFT_ADDRESS=0x81e5e1498cef5da3ce76e68cd5c02e4048b35ab6
GEARS_NFT_ADDRESS=0xdd5fd0f27d270e9faec6d6b77aa1d9b7139d21f3

HEROES_EVOLUTION_ADDRESS=0xb8dcbf278720cbb06a5b9205e42f138e6399d760
DL_HEROES_EVOLUTION_ADDRESS=0x6ddd290c07fc775093afad99a89295f60e982298
GEARS_EVOLUTION_ADDRESS=0x7efb34d49af48ac04cd5afdc5ba67466ec272cb0
```

# Steps To Deploy

1. Deploy HeroesNFT contract
2. Deploy DLHeroesNFT Contract
3. Deploy GearsNFT contract

* Set Gas Price to 2000000000
* Set Gas Limit to 40000
* SetBaseURI to "ipfs://"
***
4. Deploy Mint Contract
***
5. Deploy HeroesEvolution contract
6. Deploy DLHeroesEvolution contract
7. Deploy GearsEvolution contract
* token address is required when deploy all of them, set each NFT's contract address
***
Call AddMinter transition for NFT contracts (1, 2, 3) with the address of each NFT's evolution contracts.
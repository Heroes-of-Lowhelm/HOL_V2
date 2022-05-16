```
MINT_CONTRACT_ADDRESS=0x3f81cc88109d7f27bb82ddb1eabf2d06b7d3655a

HEROES_NFT_ADDRESS=0x618ebe52d73a482997a3d27b66d76e2133279a46
DL_HEROES_NFT_ADDRESS=0x81e5e1498cef5da3ce76e68cd5c02e4048b35ab6
GEARS_NFT_ADDRESS=0xdd5fd0f27d270e9faec6d6b77aa1d9b7139d21f3

HEROES_EVOLUTION_ADDRESS=0x0a229a74b752f916b262422a08a1d9661c1334ce
DL_HEROES_EVOLUTION_ADDRESS=0x419e6d806a7d1d304c8f0213faf5dd07663de7eb
GEARS_EVOLUTION_ADDRESS=0xa32ec48a1df1df911010e6d93e77685774056ef0
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

# Important stuffs while integrating with app
1. To stake/deposit funds to the staking contract, the app should call "IncreaseAllowance" transition of the Token contract ($HOL or $CAST).
2. The reward amount in the staking contract is the value which is multiplied 10^9 to avoid float numbers on the blockchain side, so the app should calculate the reward by division of 10^9.

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    unichain: {
      url: "https://astrochain-sepolia.gateway.tenderly.co/5neqYQoinBsj3Cc3O36Dun",
      accounts: ["0x298149d01f7a23cb938ab6874ea345516479fb70bd5e14c99c0ffaf84798ca80"],
      chainId: 1301,
    },
  },
};

export default config;

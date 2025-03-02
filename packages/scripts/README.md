# @evm-indexer/scripts

The **scripts** package contains utility scripts designed to support various operations within the project. These scripts can include database seeders, migration tools, maintenance tasks, or one-time execution scripts for setting up and managing the system.

It helps automate essential workflows, making it easier to initialize configurations, update records, or perform batch processing as needed. ⚙️📜

## available scrips

- `seed-scraper-config.ts` it will seed the database with default configuration for poligon network:
  ```json
  "chainId": 137,
  "contractAddress": "0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9",
  "providerUri": "https://polygon-rpc.com",
  "lastBlock": 61500000,
  "settings": {
    chunkSize: 2000,
    isActive: true,
  },
  ```

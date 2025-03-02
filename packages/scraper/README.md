# @evm-indexer/scraper

The **scraper** is a service that monitors blockchain events and specifically tracks the **FeeCollectedEvent** from the **FeeCollector** contract. It periodically scans new blocks, extracts event data, and stores it in a MongoDB database.

The scraper is designed to support **multiple blockchain networks**, with configurations stored in the database defining which chains to monitor. It processes events in **configurable chunks** and only scrapes data for chains marked as **active**. 🚀

# evm-indexer

This application is build using yarn workspaces and contains the following packages:

- [scraper](packages/scraper/README.md)
- [api](packages/api/README.md)
- [core](packages/core/README.md)
- [scripts](packages/scripts/README.md)

## Docker containers

- mongo
- mongo-express
- scraper
- api

`Dockerfile` builds the applications `scraper` and `api` using Yarn Workspaces in a multi-stage setup (builder, production, api & scraper stages) with the objective to to reduce the final image size.

`Dockerfile.draft` contains easy to digest steps to build the api and scraper

## Commands to start the application

Set environment variables:

```bash
cp .env.sample .env
vim .env # configure file as needed
```

Start the containers:

```bash
docker-compose up
```

If you want to build the containers separately:

```bash
# Build only the API container
docker build --target api -t my-api .

# Build only the Scraper container
docker build --target scraper -t my-scraper .
```

## Things to improve

### Add Automated Tests for Scraper and Api

- **Challenge:** Ensuring the scraper and api works as expected across different chains and configurations requires thorough testing.
- **Solution:** Implement automated tests for scraper and api
- **Benefit:** Improved reliability and reduced risk of issues in production, ensuring the scraper performs consistently across various scenarios.

### **Boost API Rate Limits**

- **Challenge:** Current free-tier API limits throttle block processing.
- **Solution:** Upgrade to a higher-tier provider or use multiple providers to process over 2000 blocks per minute.
- **Benefit:** Faster scraping, enabling quicker data collection and real-time updates across chains.

### **Job Queuing with BullMQ**

- **Challenge:** Scraping events from multiple chains can lead to slow processing and resource bottlenecks.
- **Solution:** Use BullMQ to manage distributed scraper jobs, enabling concurrent scraping with job prioritization, retries, and error handling.
- **Benefit:** Improved task management, faster scraping, and better resource utilization with fault tolerance and parallel processing.

### Add Endpoints for Scraper Configuration Management

- **Challenge:** Manually managing scraper configurations can be time-consuming and error-prone.
- **Solution:** Implement endpoints to add, update, and pause scraper configurations via the API. This allows for more flexible control over which chains to scrape and when to pause scraping operations.
- **Benefit:** Easier management of scraper configurations, enabling dynamic adjustments to scraping operations without requiring restarts.

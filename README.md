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

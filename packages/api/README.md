# @evm-indexer/api

The **API package** is a Fastify-based REST API that provides access to the scraped blockchain data. It exposes endpoints to retrieve **FeeCollectedEvent** records stored in MongoDB.

Built with **Fastify**, **Typegoose**, and **Mongoose**, the API ensures efficient querying and data retrieval. It supports **pagination**, **filtering**, and **secure database access**, making it easy to interact with collected fee data across multiple blockchain networks. 🚀

```htttp
GET /fee-collector-events/list HTTP/1.1
Host: 127.0.0.1:3000
```

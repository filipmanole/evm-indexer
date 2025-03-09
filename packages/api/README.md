# @evm-indexer/api

The **API package** is a Fastify-based REST API that provides access to the scraped blockchain data. It exposes endpoints to retrieve **FeeCollectedEvent** records stored in MongoDB.

Built with **Fastify**, **Typegoose**, and **Mongoose**, the API ensures efficient querying and data retrieval. It supports **pagination**, **filtering**, and **secure database access**, making it easy to interact with collected fee data across multiple blockchain networks. 🚀

## endpoints

### /fee-collector-events/list?page=1&limit=2

```htttp
GET /fee-collector-events/list?page=<number>&limit=<number>&integrator=<string> HTTP/1.1
Host: 127.0.0.1:3000
```

Response

```json
{
  "data": [
    {
      "_id": "ObjectId",
      "chainId": "number",
      "integrator": "ContractAddress",
      "token": "ContractAddress",
      "integratorFee": "BigNumber",
      "lifiFee": "BigNumber",
      "blockNumber": "number",
      "transactionHash": "TransactionHash",
      "timestamp": "Date ISO String",
      "createdAt": "Date ISO String",
      "updatedAt": "Date ISO String"
    }
  ],
  "total": "number",
  "page": "number",
  "pageSize": "number",
  "totalPages": "number"
}
```

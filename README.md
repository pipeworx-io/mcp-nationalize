# @pipeworx/mcp-nationalize

MCP server for nationality prediction from first names via the [Nationalize.io API](https://nationalize.io/). Free, no authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `predict_nationality` | Predict the most likely nationalities for a given first name |
| `batch_predict` | Predict nationalities for up to 10 names in one request |

## Quickstart via Pipeworx Gateway

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "nationalize__predict_nationality",
      "arguments": { "name": "Yuki" }
    },
    "id": 1
  }'
```

## License

MIT

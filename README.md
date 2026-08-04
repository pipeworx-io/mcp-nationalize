# mcp-nationalize

Nationalize MCP — nationality prediction from first name (nationalize.io, free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `predict_nationality` | Predict likely nationalities from a first name. Returns up to 5 country codes ranked by probability (0.0–1.0). Use when inferring someone's origin from their given name. |
| `batch_predict` | Predict nationalities for multiple first names at once (up to 10). Returns country codes with probability scores for each name. Use to process name lists efficiently. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "nationalize": {
      "url": "https://gateway.pipeworx.io/nationalize/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Nationalize data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

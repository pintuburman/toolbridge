# toolbridge

Convert AI tool / function-calling definitions between **Anthropic**, **OpenAI** (Chat Completions and Responses), **Gemini** and **MCP**. Zero dependencies, ESM, Node 18+.

Every provider wraps the same idea (a name, a description and a JSON Schema) in a slightly different shape, and some reject parts of JSON Schema. toolbridge handles both, so you define your tools once.

```js
import { convert, detect } from 'toolbridge';

const tool = {
  name: 'get_weather',
  description: 'Get the weather for a city',
  inputSchema: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] },
};

convert(tool, { to: 'anthropic' });          // { name, description, input_schema }
convert([tool], { to: 'openai' });           // [{ type: 'function', function: {...} }]
convert([tool], { to: 'gemini' });           // { functionDeclarations: [...] } (unsupported schema keywords removed)
detect(convert(tool, { to: 'anthropic' })); // "anthropic"
```

The source format is detected automatically. Pass `from` to force it.

## Supported formats

| name | shape |
| --- | --- |
| `mcp` | `{ name, description, inputSchema }` |
| `anthropic` | `{ name, description, input_schema }` |
| `openai` | `{ type: "function", function: { name, description, parameters } }` |
| `openai-responses` | `{ type: "function", name, description, parameters }` |
| `gemini` | `{ functionDeclarations: [{ name, description, parameters }] }` |

## Add a provider

Each provider is one small file in `src/adapters/`. Copy `anthropic.js`, change the field names, add it to the list in `src/index.js`, and add a test. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Status

Early-stage (v0.1). Tool *definitions* are covered; converting tool *calls* and *results* is planned.

## License

MIT

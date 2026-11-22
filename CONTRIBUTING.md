# Contributing

Small PRs are welcome. The easiest first contribution is a new provider adapter.

## Add a provider adapter

1. Copy `src/adapters/anthropic.js` to `src/adapters/<provider>.js`.
2. Implement:
   - `name`: the identifier users pass as `to` / `from`
   - `detect(tool)`: true only for this provider's shape
   - `toCanonical(tool)`: returns an array of `{ name, description, inputSchema }`
   - `fromCanonical(canonical)`: returns the provider's shape
   - `wrap(list)` (optional): when the provider groups tools in one object
3. Import it and add it to the `adapters` array in `src/index.js` (specific shapes before general ones).
4. Add a test in `test/` and run `npm test`.

If the provider rejects parts of JSON Schema, remove them with `stripKeys` from `src/schema.js` and link the provider's docs in a comment.

## Rules

- No runtime dependencies.
- Never mutate the caller's input (`clone` first).
- Add or update a test for every change.

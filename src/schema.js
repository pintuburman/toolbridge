/** Return a deep copy of a JSON Schema without the given keys, at every depth. */
export function stripKeys(schema, keys) {
  if (Array.isArray(schema)) return schema.map((s) => stripKeys(s, keys));
  if (schema && typeof schema === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(schema)) {
      if (!keys.includes(k)) out[k] = stripKeys(v, keys);
    }
    return out;
  }
  return schema;
}

export const EMPTY_SCHEMA = { type: 'object', properties: {} };

export const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

import { clone, stripKeys, EMPTY_SCHEMA } from '../schema.js';

// Gemini accepts only a subset of JSON Schema, so unsupported keywords are removed.
const UNSUPPORTED = ['$schema', '$id', 'additionalProperties', 'patternProperties'];

const declToCanonical = (d) => ({
  name: d.name,
  description: d.description ?? '',
  inputSchema: clone(d.parameters) ?? clone(EMPTY_SCHEMA),
});

export default {
  name: 'gemini',
  // Either a wrapper { functionDeclarations: [...] } or a single declaration.
  detect: (t) =>
    Array.isArray(t?.functionDeclarations) ||
    (typeof t?.name === 'string' && 'parameters' in t && t.type !== 'function'),
  toCanonical: (t) => (Array.isArray(t.functionDeclarations) ? t.functionDeclarations.map(declToCanonical) : [declToCanonical(t)]),
  fromCanonical: (c) => ({ name: c.name, description: c.description, parameters: stripKeys(c.inputSchema, UNSUPPORTED) }),
  wrap: (declarations) => ({ functionDeclarations: declarations }),
};

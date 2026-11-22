import { clone, EMPTY_SCHEMA } from '../schema.js';

// Responses API style: { type: "function", name, description, parameters }
export default {
  name: 'openai-responses',
  detect: (t) => t?.type === 'function' && typeof t.name === 'string',
  toCanonical: (t) => [{ name: t.name, description: t.description ?? '', inputSchema: clone(t.parameters) ?? clone(EMPTY_SCHEMA) }],
  fromCanonical: (c) => ({ type: 'function', name: c.name, description: c.description, parameters: clone(c.inputSchema) }),
};

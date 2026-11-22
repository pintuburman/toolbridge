import { clone, EMPTY_SCHEMA } from '../schema.js';

// Canonical form: { name, description, inputSchema }. MCP uses it natively.
export default {
  name: 'mcp',
  detect: (t) => typeof t?.name === 'string' && 'inputSchema' in t,
  toCanonical: (t) => [{ name: t.name, description: t.description ?? '', inputSchema: clone(t.inputSchema) ?? clone(EMPTY_SCHEMA) }],
  fromCanonical: (c) => ({ name: c.name, description: c.description, inputSchema: clone(c.inputSchema) }),
};

import { clone, EMPTY_SCHEMA } from '../schema.js';

export default {
  name: 'anthropic',
  detect: (t) => typeof t?.name === 'string' && 'input_schema' in t,
  toCanonical: (t) => [{ name: t.name, description: t.description ?? '', inputSchema: clone(t.input_schema) ?? clone(EMPTY_SCHEMA) }],
  fromCanonical: (c) => ({ name: c.name, description: c.description, input_schema: clone(c.inputSchema) }),
};

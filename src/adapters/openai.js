import { clone, EMPTY_SCHEMA } from '../schema.js';

// Chat Completions style: { type: "function", function: { name, description, parameters } }
export default {
  name: 'openai',
  detect: (t) => t?.type === 'function' && typeof t.function?.name === 'string',
  toCanonical: (t) => [
    { name: t.function.name, description: t.function.description ?? '', inputSchema: clone(t.function.parameters) ?? clone(EMPTY_SCHEMA) },
  ],
  fromCanonical: (c) => ({
    type: 'function',
    function: { name: c.name, description: c.description, parameters: clone(c.inputSchema) },
  }),
};

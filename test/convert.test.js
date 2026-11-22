import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convert, detect, toCanonical, adapters } from '../src/index.js';

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    city: { type: 'string', description: 'City name' },
    opts: { type: 'object', properties: { units: { type: 'string' } }, additionalProperties: false },
  },
  required: ['city'],
  additionalProperties: false,
};

const mcpTool = { name: 'get_weather', description: 'Get weather', inputSchema: schema };

test('detects every supported format', () => {
  assert.equal(detect(mcpTool), 'mcp');
  assert.equal(detect(convert(mcpTool, { to: 'anthropic' })), 'anthropic');
  assert.equal(detect(convert(mcpTool, { to: 'openai' })), 'openai');
  assert.equal(detect(convert(mcpTool, { to: 'openai-responses' })), 'openai-responses');
  assert.equal(detect({ name: 'x', parameters: {} }), 'gemini');
  assert.equal(detect({ functionDeclarations: [] }), 'gemini');
  assert.equal(detect({ nope: true }), undefined);
});

test('mcp -> anthropic renames inputSchema', () => {
  const out = convert(mcpTool, { to: 'anthropic' });
  assert.deepEqual(out, { name: 'get_weather', description: 'Get weather', input_schema: schema });
});

test('mcp -> openai nests under function.parameters', () => {
  const out = convert(mcpTool, { to: 'openai' });
  assert.equal(out.type, 'function');
  assert.equal(out.function.name, 'get_weather');
  assert.deepEqual(out.function.parameters, schema);
});

test('gemini output strips unsupported schema keywords at every depth', () => {
  const out = convert([mcpTool], { to: 'gemini' });
  const params = out.functionDeclarations[0].parameters;
  assert.equal('$schema' in params, false);
  assert.equal('additionalProperties' in params, false);
  assert.equal('additionalProperties' in params.properties.opts, false);
  assert.deepEqual(params.required, ['city']);
});

test('round trip through every adapter keeps name, description and required', () => {
  for (const { name: via } of adapters) {
    const mid = convert(mcpTool, { to: via });
    const [back] = toCanonical(mid);
    assert.equal(back.name, 'get_weather', via);
    assert.equal(back.description, 'Get weather', via);
    assert.deepEqual(back.inputSchema.required, ['city'], via);
  }
});

test('arrays stay arrays and single tools stay single', () => {
  assert.equal(Array.isArray(convert([mcpTool], { to: 'anthropic' })), true);
  assert.equal(Array.isArray(convert(mcpTool, { to: 'anthropic' })), false);
});

test('missing schema becomes an empty object schema', () => {
  const [c] = toCanonical({ name: 'ping', description: 'p', input_schema: undefined, ...{ input_schema: undefined } }, 'anthropic');
  assert.deepEqual(c.inputSchema, { type: 'object', properties: {} });
});

test('does not mutate the input', () => {
  const copy = JSON.parse(JSON.stringify(mcpTool));
  convert(mcpTool, { to: 'gemini' });
  assert.deepEqual(mcpTool, copy);
});

test('unknown target and undetectable input throw clear errors', () => {
  assert.throws(() => convert(mcpTool, { to: 'nope' }), /Unknown format "nope"/);
  assert.throws(() => convert({ foo: 1 }, { to: 'openai' }), /Could not detect/);
});

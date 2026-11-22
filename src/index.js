import mcp from './adapters/mcp.js';
import anthropic from './adapters/anthropic.js';
import openai from './adapters/openai.js';
import openaiResponses from './adapters/openai-responses.js';
import gemini from './adapters/gemini.js';

// To support a new provider, add a file in src/adapters/ and list it here.
// Order matters for detect(): more specific shapes go first.
export const adapters = [openai, openaiResponses, anthropic, gemini, mcp];
const byName = new Map(adapters.map((a) => [a.name, a]));

function getAdapter(name) {
  const adapter = byName.get(name);
  if (!adapter) throw new Error(`Unknown format "${name}". Known: ${[...byName.keys()].join(', ')}`);
  return adapter;
}

/** Guess which provider format a tool definition is in. Returns a name or undefined. */
export function detect(tool) {
  return adapters.find((a) => a.detect(tool))?.name;
}

/** Normalize tools of any supported format to { name, description, inputSchema }. */
export function toCanonical(tools, from) {
  return [].concat(tools).flatMap((tool) => {
    const adapter = from ? getAdapter(from) : adapters.find((a) => a.detect(tool));
    if (!adapter) throw new Error(`Could not detect the format of tool: ${JSON.stringify(tool).slice(0, 80)}`);
    return adapter.toCanonical(tool);
  });
}

/**
 * Convert one tool or an array of tools to another provider's format.
 * convert(tools, { to: 'anthropic' })  // `from` is auto-detected per tool
 */
export function convert(tools, { to, from } = {}) {
  const target = getAdapter(to);
  const out = toCanonical(tools, from).map((c) => target.fromCanonical(c));
  if (target.wrap) return target.wrap(out);
  return Array.isArray(tools) ? out : out[0];
}

/**
 * Nationalize MCP — nationality prediction from first name (nationalize.io, free, no auth)
 *
 * Tools:
 * - predict_nationality: Predict the nationality of a person from their first name
 * - batch_predict: Predict nationalities for up to 10 names in one request
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://api.nationalize.io';

type NationalityEntry = {
  country_id: string;
  probability: number;
};

type NationalizeResult = {
  count: number;
  name: string;
  country: NationalityEntry[];
};

type NationalizeResponse = NationalizeResult | NationalizeResult[];

const tools: McpToolExport['tools'] = [
  {
    name: 'predict_nationality',
    description:
      'Predict the most likely nationalities for a given first name, ranked by probability. Returns up to 5 country codes with probability scores.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'First name to predict nationality for.',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'batch_predict',
    description:
      'Predict nationalities for multiple first names in a single request (up to 10 names). Returns ranked nationality probabilities for each name.',
    inputSchema: {
      type: 'object',
      properties: {
        names: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of first names to predict nationality for (maximum 10).',
          maxItems: 10,
        },
      },
      required: ['names'],
    },
  },
];

function formatResult(result: NationalizeResult) {
  return {
    name: result.name,
    sample_size: result.count,
    nationalities: result.country.map((c) => ({
      country_code: c.country_id,
      probability: c.probability,
    })),
  };
}

async function predictNationality(name: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Nationalize error: ${res.status}`);

  const data = (await res.json()) as NationalizeResult;
  return formatResult(data);
}

async function batchPredict(names: string[]): Promise<unknown> {
  if (names.length === 0) throw new Error('At least one name is required');
  if (names.length > 10) throw new Error('Maximum 10 names per batch request');

  const params = names.map((n) => `name[]=${encodeURIComponent(n)}`).join('&');
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Nationalize error: ${res.status}`);

  const data = (await res.json()) as NationalizeResponse;
  const results = Array.isArray(data) ? data : [data];

  return { results: results.map(formatResult) };
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'predict_nationality':
      return predictNationality(args.name as string);
    case 'batch_predict':
      return batchPredict(args.names as string[]);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;

import type { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import { getOpenAIResponse, getClaudeResponse } from '../../lib/langchain';

type Data = {
  answer?: string;
  error?: string;
  details?: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const form = new multiparty.Form();

    form.parse(req, async (err: Error, fields: { [key: string]: string[] }, files: { [key: string]: any }) => {
      if (err) {
        console.error('Error parsing form data:', err);
        res.status(500).json({ error: 'Error parsing form data', details: err.message });
        return;
      }

      try {
        console.log('Received fields:', fields);

        const provider = fields.provider?.[0];
        const apiKey = fields.apiKey?.[0];
        const question = fields.question?.[0];
        const selectedModel = fields.selectedModel?.[0];

        if (!provider || !apiKey || !question || !selectedModel) {
          throw new Error('Missing required fields');
        }

        console.log('Provider:', provider);
        console.log('API Key:', apiKey ? '****' + apiKey.slice(-4) : 'Not provided');
        console.log('Question:', question);
        console.log('Selected Model:', selectedModel);

        let answer = '';

        if (provider.toLowerCase() === 'openai') {
          const response = await getOpenAIResponse(apiKey, selectedModel, question);
          answer = JSON.stringify(response);
        } else if (provider.toLowerCase() === 'claude') {
          const response = await getClaudeResponse(apiKey, selectedModel, question);
          answer = JSON.stringify(response);
        } else {
          throw new Error('Invalid provider');
        }

        console.log('Answer:', answer);

        res.status(200).json({ answer });
      } catch (error: any) {
        console.error('Error processing request:', error);
        res.status(500).json({ 
          error: 'There was an error processing your request.', 
          details: error.message || 'Unknown error occurred' 
        });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
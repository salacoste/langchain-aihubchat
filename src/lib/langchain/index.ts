import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";

export const getOpenAIResponse = async (apiKey: string, model: string, question: string) => {
  const openAI = new ChatOpenAI({
    modelName: model,
    openAIApiKey: apiKey,
  });

  try {
    const response = await openAI.invoke([new HumanMessage(question)]);
    return response.content;
  } catch (error: any) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};

export const getClaudeResponse = async (apiKey: string, model: string, question: string) => {
  // Map the model names from our UI to the correct Anthropic model names
  const modelMap: { [key: string]: string } = {
    'claude-3-5-sonnet': 'claude-3-sonnet-20240229',
    'claude-3-5-opus': 'claude-3-opus-20240229',
    'claude-3-sonnet': 'claude-3-sonnet-20240229',
    'claude-3-haiku': 'claude-3-haiku-20240307',
  };

  const anthropicModel = modelMap[model] || 'claude-3-sonnet-20240229'; // Default to claude-3-sonnet if no match

  const claude = new ChatAnthropic({
    modelName: anthropicModel,
    anthropicApiKey: apiKey,
  });

  try {
    const response = await claude.invoke([new HumanMessage(question)]);
    return response.content;
  } catch (error: any) {
    throw new Error(`Claude API error: ${error.message}`);
  }
};
import OpenAI from 'openai';

export const createThread = async (openai: OpenAI) => {
  const id = (await openai.beta.threads.create()).id;
  return { id };
};

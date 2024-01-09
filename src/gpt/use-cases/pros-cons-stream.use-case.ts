import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscusserStreamUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  return await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
            You will be provided with a question and your task is to give an answer with pro and cons.
            The answer have to be in markdown format.
            Pro and cons have to be in a list
          `,
      },
      { role: 'user', content: prompt },
    ],
    stream: true,
    model: 'gpt-3.5-turbo',
  });
};

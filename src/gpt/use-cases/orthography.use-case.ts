import OpenAI from 'openai';
interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
            You will be provided with texts in english with possible orthography and grammatical mistakes. You have to answer in JSON format, your task is to correct them and answer back possible solutions, you also have to give a accuracy percentage.

            If there are no errors, you have to answer a congratulation message

            Example of output/answer:
            {
              userScore: percentage, // Give a score to the user text spell
              errors: string[], // ["error -> solution"],
              message: string // Use emojis and text to give feedback to user, and always answer with a correction if there were mistakes
            }
          `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo',
  });

  return JSON.parse(completion.choices[0].message.content);
};

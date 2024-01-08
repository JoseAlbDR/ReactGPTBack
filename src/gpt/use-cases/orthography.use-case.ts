import OpenAI from 'openai';
interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
            You will be provided with texts in english with possible orthography and grammatical mistakes. You have to answer in JSON format, your task is to correct them and answer back possible solutions, you also have to give a accuracy percentage.

            If there are no errors, you have to answer a congratulation message

            Example of output/answer:
            {
              userScore: number,
              errors: string[], // ["error => solution"],
              message: string // Use emojis and text to give feedback to user
            }
          `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo',
  });

  console.log(completion);

  return completion.choices[0];
};

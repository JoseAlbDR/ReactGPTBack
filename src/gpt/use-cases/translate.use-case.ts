import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const TranslateUseCase = async (
  openai: OpenAI,
  { prompt, lang }: Options,
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          You will be provided with text in any language and you have to translate to ${lang} language.

          Example of a correct translation to english:
          Hola me llamo Alberto => Hello my name is Alberto

          Example of a correct translation to french:
          Hello my name is Alberto => Salut je suis Alberto

        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  return JSON.parse(completion.choices[0].message.content);
};

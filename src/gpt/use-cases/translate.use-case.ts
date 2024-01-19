import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (
  openai: OpenAI,
  { prompt, lang }: Options,
) => {
  return await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          Translate the following text to language ${lang}: ${prompt}.

          Example of a correct translation to english:
          Hola me llamo Alberto => Hello my name is Alberto

          Example of a correct translation to french:
          Hello my name is Alberto => Salut je suis Alberto

        `,
      },
    ],
    stream: true,
    model: 'gpt-3.5-turbo',
  });
};

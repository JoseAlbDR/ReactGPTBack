import OpenAI from 'openai';
import * as fs from 'fs';

interface Options {
  prompt?: string;
  file: Express.Multer.File;
}

export const audioToTextUseCase = async (
  openai: OpenAI,
  { prompt, file }: Options,
) => {
  console.log({ prompt, file });

  const response = await openai.audio.translations.create({
    model: 'whisper-1',
    file: fs.createReadStream(file.path),
    prompt, // Same as audio language
    response_format: 'vtt',
  });

  console.log({ response });

  return response;
};

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
  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(file.path),
    prompt, // Same as audio language
    // response_format: 'vtt',
    // response_format: 'srt',
    response_format: 'verbose_json',
  });

  return response;
};

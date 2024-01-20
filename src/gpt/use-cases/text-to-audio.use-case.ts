import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

import { Uuid } from '../adapters';

type Voice = 'nova' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'shimmer';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openai: OpenAI,
  { prompt, voice }: Options,
) => {
  const voices: { [key: string]: Voice } = {
    nova: 'nova',
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    shimmer: 'shimmer',
  };
  const selectedVoice: Voice = voices[voice] || 'nova';

  // TODO Use userId for folderPath
  const folderPath = path.resolve(__dirname, '../../../generated/audios/');

  // TODO adapt uuid for file name
  const speechFile = path.resolve(`${folderPath}/${Uuid.v4()}.mp3`);

  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  fs.writeFileSync(speechFile, buffer);

  return {
    speechFile,
  };
};

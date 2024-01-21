import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGeneratorUseCase = async (
  openai: OpenAI,
  { prompt, originalImage, maskImage }: Options,
) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    quality: 'standard',
    style: 'vivid',
    response_format: 'url',
    size: '1024x1024',
  });

  await downloadImageAsPng(response.data[0].url);

  return {
    url: response.data[0].url,
    localPath: '',
    revised_prompt: response.data[0].revised_prompt,
  };
};

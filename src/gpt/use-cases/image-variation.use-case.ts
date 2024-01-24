import OpenAI from 'openai';
import * as fs from 'fs';
import { downloadImageAsPng } from 'src/helpers';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  { baseImage }: Options,
) => {
  const imagePng = await downloadImageAsPng(baseImage, true);

  const image = fs.createReadStream(imagePng);

  const response = await openai.images.createVariation({
    image,
    model: 'dall-e-2',
    n: 1,
    response_format: 'url',
    size: '1024x1024',
  });

  const imageName = await downloadImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generator/${imageName}`;

  return {
    url,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};

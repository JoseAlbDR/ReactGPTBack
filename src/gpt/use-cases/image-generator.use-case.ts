import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGeneratorUseCase = async (
  openai: OpenAI,
  { prompt, originalImage, maskImage }: Options,
) => {
  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      quality: 'standard',
      style: 'vivid',
      response_format: 'url',
      size: '1024x1024',
    });

    const url = await downloadImageAsPng(response.data[0].url);

    return {
      url, // TODO: http://localhost:3000/...
      openAIUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  const pngImagePath = await downloadImageAsPng(originalImage);
  const maskPath = await downloadBase64ImageAsPng(maskImage);

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt,
    mask: fs.createReadStream(maskPath),
    image: fs.createReadStream(pngImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const localImagePath = await downloadImageAsPng(response.data[0].url);
  const fileName = path.basename(localImagePath);
  const publicUrl = `localhost:3000/${fileName}`;

  return {
    url: publicUrl, // TODO: http://localhost:3000/...
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};

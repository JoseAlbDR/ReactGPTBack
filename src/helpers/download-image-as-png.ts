import { InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { Uuid } from 'src/gpt/adapters';

export const downloadImageAsPng = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok)
    throw new InternalServerErrorException('Download image failed');

  const folderPath = path.resolve('./', './generated/images/');

  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${Uuid.v4()}.png`;

  const buffer = Buffer.from(await response.arrayBuffer());

  const completePath = path.join(folderPath, imageNamePng);

  await sharp(buffer).png().ensureAlpha().toFile(completePath);

  return completePath;
};

export const downloadBase64ImageAsPng = async (base64Image: string) => {
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;

  const completePath = path.join(folderPath, imageNamePng);

  await sharp(imageBuffer).png().ensureAlpha().toFile(completePath);

  return path.join(folderPath, imageNamePng);
};

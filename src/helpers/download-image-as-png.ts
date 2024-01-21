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

  // fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);

  const completePath = path.join(folderPath, imageNamePng);

  await sharp(buffer).png().ensureAlpha().toFile(completePath);

  return completePath;
};

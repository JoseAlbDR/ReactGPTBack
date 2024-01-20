import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export const textToAudioUseCaseGetter = (id: string) => {
  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const filePath = path.resolve(folderPath, `${id}.mp3`);

  if (!fs.existsSync(filePath)) {
    throw new NotFoundException(`File ${id}.mp3 does not exist`);
  }

  return filePath;
};

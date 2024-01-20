import * as fs from 'fs';
import * as path from 'path';

export const textToAudioUseCaseGetter = (id: string) => {
  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const filePath = path.resolve(`${folderPath}/${id}.mp3`);

  console.log({ filePath });

  if (!fs.existsSync(filePath)) return null;

  return filePath;
};

import * as fs from 'fs';
import * as path from 'path';

import { Injectable, NotFoundException } from '@nestjs/common';
import {
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  translateUseCase,
  textToAudioUseCase,
  audioToTextUseCase,
  imageGeneratorUseCase,
} from './use-cases';
import {
  ImageGeneratorDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  AudioToTextDto,
} from './dtos';
import OpenAI from 'openai';
import { TranslateDto } from './dtos/translate.dto';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // Only call use cases

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }
  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openai, translateDto);
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, textToAudioDto);
  }

  getAudio(id: string) {
    const folderPath = path.resolve(__dirname, '../../../generated/audios');
    const filePath = path.resolve(folderPath, `${id}.mp3`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${id}.mp3 does not exist`);
    }

    return filePath;
  }

  async audioToText(file: Express.Multer.File, { prompt }: AudioToTextDto) {
    return await audioToTextUseCase(this.openai, { file, prompt });
  }

  async imageGenerator(imageGeneratorDto: ImageGeneratorDto) {
    return await imageGeneratorUseCase(this.openai, imageGeneratorDto);
  }

  getImage(imageName: string) {
    const folderPath = path.resolve(__dirname, '../../generated/images');
    const imagePath = path.resolve(folderPath, `${imageName}.png`);

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException(`File ${imageName}.png does not exist`);
    }

    return imagePath;
  }
}

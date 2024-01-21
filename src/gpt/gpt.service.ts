import { Injectable } from '@nestjs/common';
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
import { textToAudioUseCaseGetter } from './use-cases/text-to-audio-getter.use-case';

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

  textToAudioGetter(id: string) {
    return textToAudioUseCaseGetter(id);
  }

  async audioToText(file: Express.Multer.File, { prompt }: AudioToTextDto) {
    return await audioToTextUseCase(this.openai, { file, prompt });
  }

  async imageGenerator(imageGeneratorDto: ImageGeneratorDto) {
    return await imageGeneratorUseCase(this.openai, imageGeneratorDto);
  }
}

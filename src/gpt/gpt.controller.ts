import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import { Response } from 'express';
import { ChatCompletionChunk } from 'openai/resources';
import { Stream } from 'openai/streaming';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  private async getStream(res: Response, stream: Stream<ChatCompletionChunk>) {
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }

    res.end();
  }

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);

    this.getStream(res, stream);
  }

  @Post('translate')
  async translate(@Body() translateDto: TranslateDto, @Res() res: Response) {
    const stream = await this.gptService.translate(translateDto);

    this.getStream(res, stream);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const { speechFile } = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);

    res.sendFile(speechFile);
  }

  @Get('text-to-audio/:id')
  textToAudioGetter(@Param() { id }, @Res() res: Response) {
    console.log({ id });

    const audioFile = this.gptService.textToAudioGetter(id);

    if (!audioFile)
      return res.status(404).json({ message: 'Audio file not found' });

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK).sendFile(audioFile);
  }
}

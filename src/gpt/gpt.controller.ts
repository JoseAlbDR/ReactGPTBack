import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { GptService } from './gpt.service';
import {
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import { Response } from 'express';
import { ChatCompletionChunk } from 'openai/resources';
import { Stream } from 'openai/streaming';
import { FileInterceptor } from '@nestjs/platform-express';
import { Uuid } from './adapters';
import { AudioToTextDto } from './dtos/audio-to-text.dto';
import { ImageGeneratorDto } from './dtos/image-generator.dto';

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
  textToAudioGetter(@Param('id') id: string, @Res() res: Response) {
    const audioFile = this.gptService.getAudio(id);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(audioFile);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads/',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${Uuid.v4()}.${fileExtension}`;
          return cb(null, fileName);
        },
      }),
    }),
  )
  audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5mb',
          }),
          new FileTypeValidator({
            fileType: 'audio/*',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }

  @Post('image-generator')
  async imageGenerator(@Body() imageGeneratorDto: ImageGeneratorDto) {
    return this.gptService.imageGenerator(imageGeneratorDto);
  }

  @Get('image-generator/:imageName')
  async imageGeneratorGetter(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const imageFile = this.gptService.getImage(imageName);

    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(imageFile);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return this.gptService.generateImageVariation(imageVariationDto);
  }
}

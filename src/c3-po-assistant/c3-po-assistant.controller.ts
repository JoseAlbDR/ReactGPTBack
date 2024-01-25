import { Body, Controller, Post } from '@nestjs/common';
import { C3PoAssistantService } from './c3-po-assistant.service';
import { UserQuestionDto } from './dtos/user-question.dto';

@Controller('c3po-assistant')
export class C3PoAssistantController {
  constructor(private readonly c3PoAssistantService: C3PoAssistantService) {}

  @Post('create-thread')
  async createThread() {
    return await this.c3PoAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() userQuestionDto: UserQuestionDto) {
    return await this.c3PoAssistantService.userQuestion(userQuestionDto);
  }
}

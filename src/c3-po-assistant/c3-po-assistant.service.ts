import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  checkCompleteStatusUseCase,
  createRunUseCase,
  createThreadUseCase,
} from './use-cases';
import { UserQuestionDto } from './dtos/user-question.dto';
import { createMessageUseCase } from './use-cases/create-message.use-case';

@Injectable()
export class C3PoAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion(userQuestionDto: UserQuestionDto) {
    const message = await createMessageUseCase(this.openai, userQuestionDto);

    const run = await createRunUseCase(this.openai, {
      threadId: userQuestionDto.threadId,
    });

    await checkCompleteStatusUseCase(this.openai, {
      runId: run.id,
      threadId: userQuestionDto.threadId,
    });
  }
}

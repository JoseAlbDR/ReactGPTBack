import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createThread } from './use-cases';

@Injectable()
export class C3PoAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThread(this.openai);
  }
}

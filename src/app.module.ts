import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { C3PoAssistantModule } from './c3-po-assistant/c3-po-assistant.module';

@Module({
  imports: [GptModule, ConfigModule.forRoot(), C3PoAssistantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

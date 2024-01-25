import { Module } from '@nestjs/common';
import { C3PoAssistantService } from './c3-po-assistant.service';
import { C3PoAssistantController } from './c3-po-assistant.controller';

@Module({
  controllers: [C3PoAssistantController],
  providers: [C3PoAssistantService],
})
export class C3PoAssistantModule {}

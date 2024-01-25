import { Controller } from '@nestjs/common';
import { C3PoAssistantService } from './c3-po-assistant.service';

@Controller('c3-po-assistant')
export class C3PoAssistantController {
  constructor(private readonly c3PoAssistantService: C3PoAssistantService) {}
}

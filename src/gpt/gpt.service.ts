import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';

@Injectable()
export class GptService {
  // Only call use cases

  async orthographyCheck() {
    return await orthographyCheckUseCase();
  }
}

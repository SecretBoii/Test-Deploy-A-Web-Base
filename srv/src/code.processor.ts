import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeProcessor {
  getProblems() {
    return [];
  }

  getSubmissions() {
    return [];
  }

  process(code: string) {
    return { processed: true };
  }
}

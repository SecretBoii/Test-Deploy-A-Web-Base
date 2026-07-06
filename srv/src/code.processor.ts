// src/code.processor.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeProcessor {
  // จำลองฟังก์ชันดึงโจทย์ส่งออกไป
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
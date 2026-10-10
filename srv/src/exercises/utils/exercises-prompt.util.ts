export interface GemmaExerciseInfo {
  title: string;
  description: string;
  topic: string;
  objective: string;
}

export interface GemmaRunResult {
  status: string;
  stdout: string;
  stderr: string;
}

export interface ParsedAiResponse {
  score: number;
  exception_message: string | null;
  ai_feedback: string | null;
  event_type: string;
  run_count: number;
}

export function buildGemmaPrompt(
  sourceCode: string,
  runResult: GemmaRunResult,
  eventType: string,
  runCount: number,
  exercise: GemmaExerciseInfo,
  getSkillGuideline: (skillName: string) => string,
): string {
  const securityRules = getSkillGuideline('security');
  const complexityRules = getSkillGuideline('complexity');
  const pep8Rules = getSkillGuideline('pep8');
  const edgeCasesRules = getSkillGuideline('edge_cases');
  const dynamicRubricRules = getSkillGuideline('dynamic_rubric');

  let hintLevelInstruction = '';
  if (runCount <= 2) {
    hintLevelInstruction = `
      - Level 1 Conceptual Hint: Ask an open-ended question or give a high-level conceptual hint. Strictly DO NOT specify line numbers, do NOT point directly to errors, and NEVER write any code solutions or snippets.
    `;
  } else if (runCount <= 4) {
    hintLevelInstruction = `
      - Level 2 Scoped Hint: Guide the student to inspect the specific logical block, variable state, or output discrepancy through thought-provoking questions. Strictly do NOT provide code solutions or fixes.
    `;
  } else {
    hintLevelInstruction = `
      - Level 3 Logical Insight: Explain why the current logic behaves unexpectedly, or highlight the discrepancy between the code behavior and requirements. You may point to the general area of logic, but you are STRICTLY PROHIBITED from providing direct code solutions, corrected code snippets, or explicit answers. Guide them to solve it themselves.
    `;
  }

  return ` 
    Evaluate the student's Python program based on the following information:
    Exercise Title: "${exercise.title}"
    Exercise Description: "${exercise.description}"
    Topic: "${exercise.topic}"
    Objective/Rubric: "${exercise.objective}"
    
    Student's Source Code:
    "${sourceCode}"
    
    Execution Output from Sandbox:
    - Status: ${runResult.status}
    - Output: ${runResult.stdout || 'None'}
    - Error: ${runResult.stderr || 'None'}

    Additional rules to evaluate (use these criteria):
    [Correctness Check] Evaluate the student's code and execution output based on its proximity/closeness to the requirements described in the 'Exercise Description'. If the printed output or logic is completely correct, award a score of 100. If it is partially correct (e.g., minor typos, case mismatch such as printing "Hello Python" or "hello python" instead of "Welcome to Python", or slightly incorrect output format), deduct some score proportionally (e.g. award a partial score like 50 to 80 points) and provide guiding questions for the student to notice the difference. Give a score of 0 only if the output or logic is completely wrong, unrelated, or failed to compile/run.
    [Security Check] ${securityRules}
    [Complexity/Big-O Check] ${complexityRules}
    [PEP 8 Cleanliness Check] ${pep8Rules}
    [Edge Cases Check] ${edgeCasesRules}
    [Dynamic Rubric Check] ${dynamicRubricRules}
    
    Hint rules you MUST follow for this run count:
    ${hintLevelInstruction}

    ====================================================
    [FEW-SHOT EXAMPLES OF DESIRED SOCRATIC HINTS VS PROHIBITED RESPONSES]
    Example 1 (Data Type mismatch / Input string conversion):
      - [PROHIBITED] (Direct answer): "ต้องใช้ int(input()) แปลงตัวเลขก่อนนำมาบวกกันครับ"
      - [DESIRED] (Socratic Hint): "ลองตรวจสอบชนิดข้อมูลของตัวแปรที่รับเข้ามาก่อนนำไปคำนวณดูครับ ว่าพร้อมสำหรับการคำนวณทางคณิตศาสตร์แล้วหรือยัง?"

    Example 2 (Typo or slight mismatch in terminal output):
      - [PROHIBITED] (Direct answer): "ต้อง print คำว่า 'Total: ' ไม่ใช่ 'Sum: ' ครับ"
      - [DESIRED] (Socratic Hint): "ลองเปรียบเทียบข้อความที่แสดงใน Terminal กับรูปแบบผลลัพธ์ที่โจทย์กำหนดดูครับ ว่ามีคำใดที่ยังไม่ตรงกัน?"

    Example 3 (Loop condition or Off-by-one error):
      - [PROHIBITED] (Direct answer): "ลูปขาดไปหนึ่งรอบ ให้แก้เป็น range(1, n + 1) ครับ"
      - [DESIRED] (Socratic Hint): "ลองสังเกตรอบสุดท้ายของการวนลูปดูครับ ว่าค่าตัวนับไปถึงตัวเลขเป้าหมายตามที่โจทย์ต้องการครบถ้วนแล้วหรือยัง?"

    Example 4 (Runtime Error / Exception occurred):
      - [PROHIBITED] (Direct answer): "เกิด ZeroDivisionError ให้ใส่ if b != 0: ดักไว้ก่อนหาร"
      - [DESIRED] (Socratic Hint): "ลองตรวจสอบสาเหตุของข้อผิดพลาดที่เกิดขึ้นใน Console ดูครับ ว่ามีตัวหารหรือค่าใดที่ทำให้โปรแกรมไม่สามารถคำนวณต่อได้?"
    ====================================================

    ====================================================
    CRITICAL INSTRUCTIONS FOR RESPONSE (JSON ONLY):
    Return a JSON object ONLY. Do not write any conversational intro, greetings, warnings, markdown wrappers, or outros.
    
    - For "score": <overall evaluation score as an integer from 0 to 100>,
    - For "exception_message": If a compilation or runtime error occurred, provide only the short name/type of the exception (e.g. "ValueError" or "SyntaxError"). Do not explain the exception. If no error occurred, use null.
    - For "ai_feedback": ให้ตอบเป็นข้อความภาษาไทยปกติที่เป็นธรรมชาติ สุภาพ กระชับ (1-2 ประโยค ไม่เกิน 40 คำ) โดยใช้เทคนิค Socratic Method (ถามนำกระตุ้นคิด ไม่เฉลยคำตอบ):
      * [กฎเหล็กเด็ดขาด] ห้ามเฉลยคำตอบ ห้ามบอกโค้ดที่ถูกต้อง ห้ามเขียนโค้ดตัวอย่าง และห้ามบอกวิธีแก้ตรงๆ (เช่น ห้ามพูดว่า "ควรเปลี่ยน X เป็น Y" หรือ "ให้ใช้ฟังก์ชัน Z")
      * หากโค้ดยังไม่ผ่านเกณฑ์: ให้บอกใบ้แบบอ้อมๆ โดยตั้งคำถามชี้นำ (Guiding Question) หรือชวนให้นักเรียนกลับไปสังเกตจุดที่ต้องวิเคราะห์ด้วยตนเอง เช่น:
        - กรณีข้อความหรือผลลัพธ์ไม่ตรง: "ลองตรวจสอบและเปรียบเทียบข้อความที่แสดงใน Output กับรูปแบบที่โจทย์ระบุดูครับว่ามีจุดใดที่ต่างกันบ้าง?"
        - กรณีชนิดข้อมูลหรือตัวแปรผิด: "ลองสังเกตชนิดข้อมูลของตัวแปรที่รับเข้ามาก่อนนำไปประมวลผลดูครับว่าพร้อมใช้คำนวณแล้วหรือยัง?"
        - กรณีตรรกะหรือลูปไม่ครบ: "ลองสังเกตรอบสุดท้ายของการทำงานหรือเงื่อนไขตรวจสอบดูครับว่าครอบคลุมกรณีที่โจทย์ต้องการครบถ้วนหรือไม่?"
      * หากโค้ดทำงานถูกต้องเรียบร้อยแล้ว: ให้ตอบชื่นชมสั้นๆ และชวนคิดต่อยอด เช่น "โค้ดทำงานได้ถูกต้องเรียบร้อยครับ ลองคิดดูว่ามีแนวทางใดที่ช่วยให้โค้ดอ่านง่ายหรือกระชับขึ้นได้อีกบ้าง"
      * เน้นประโยคคำถามชี้นำที่กระตุ้นการคิดวิเคราะห์ ความยาว 1-2 ประโยคกระชับที่สุด

    The response must exactly follow this JSON schema:
    {
      "score": <overall evaluation score as an integer from 0 to 100>,
      "exception_message": "<extremely short exception type or null>",
      "ai_feedback": "<highly concise, Socratic Thai hint sentence (max 40 words)>"
    }
  `;
}

export function sanitizeAiFeedback(feedback: string | null): string | null {
  if (!feedback) return null;

  let sanitized = feedback;

  // ลบบล็อกโค้ด markdown (```...``` หรือ `...`) ออก เพื่อการันตีว่าไม่มี snippet โค้ดหลุดไป
  sanitized = sanitized.replace(/```[\s\S]*?```/g, '').trim();

  // ตัดคำนำหน้าที่ชี้นำเฉลยตรงๆ ออก
  sanitized = sanitized
    .replace(/^(เฉลยคือ|คำตอบที่ถูกต้องคือ|โค้ดที่ถูกต้องคือ)[\s:]*/i, '')
    .trim();

  return sanitized || null;
}

export function parseAiResponse(
  aiText: string,
  defaultScore: number,
  eventType: string,
  runCount: number,
): ParsedAiResponse {
  const safe_event_type = eventType || 'submit';
  const safe_run_count = typeof runCount === 'number' ? runCount : 0;

  try {
    const cleanText = aiText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    try {
      const parsed = JSON.parse(cleanText);
      return {
        score: typeof parsed.score === 'number' ? parsed.score : defaultScore,
        exception_message: parsed.exception_message ?? null,
        ai_feedback: sanitizeAiFeedback(parsed.ai_feedback ?? null),
        event_type: parsed.event_type ?? safe_event_type,
        run_count:
          typeof parsed.run_count === 'number'
            ? parsed.run_count
            : safe_run_count,
      };
    } catch (innerParseError) {
      const scoreMatch = cleanText.match(/"score"\s*:\s*(\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : defaultScore;

      const exceptionMatch = cleanText.match(
        /"exception_message"\s*:\s*"((?:[^"\\]|\\.)*)"/,
      );
      let exception_message: string | null = null;
      if (exceptionMatch) {
        exception_message = exceptionMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
      }

      const feedbackMatch = cleanText.match(
        /"ai_feedback"\s*:\s*"((?:[^"\\]|\\.)*)"/,
      );
      let ai_feedback: string | null = null;
      if (feedbackMatch) {
        ai_feedback = feedbackMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
      }

      return {
        score,
        exception_message: exception_message || null,
        ai_feedback: sanitizeAiFeedback(ai_feedback),
        event_type: safe_event_type,
        run_count: safe_run_count,
      };
    }
  } catch (parseError) {
    return {
      score: defaultScore,
      exception_message: 'Failed to parse JSON structure',
      ai_feedback: `Could not parse AI response as JSON: ${(parseError as Error).message}`,
      event_type: safe_event_type,
      run_count: safe_run_count,
    };
  }
}

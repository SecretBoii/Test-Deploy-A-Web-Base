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
  const adaptiveHintsRules = getSkillGuideline('adaptive_hints');

  let hintLevelInstruction = '';
  if (runCount <= 2) {
    hintLevelInstruction = `
      - Level 1 Conceptual Hint (รอบที่ ${runCount}): ถามนำกระตุ้นคิดในภาพรวมเชิงแนวคิด (Conceptual Overview) ห้ามระบุเลขบรรทัด และห้ามเขียนโค้ดตัวอย่างหรือ snippet โดยเด็ดขาด
    `;
  } else if (runCount <= 4) {
    hintLevelInstruction = `
      - Level 2 Scoped Hint (รอบที่ ${runCount}): ชี้เป้าขอบเขตของตรรกะหรือคำสั่งที่มีปัญหาให้แคบลง (Scoped Logic Block) ถามนำให้นักเรียนวิเคราะห์สาเหตุด้วยตนเอง ห้ามบอกวิธีแก้ตรงๆ
    `;
  } else {
    hintLevelInstruction = `
      - Level 3 Logical Insight (รอบที่ ${runCount}): อธิบายพฤติกรรมของโค้ดว่าทำไมจึงให้ผลลัพธ์ต่างจากโจทย์ (Behavioral Insight) ห้ามพิมพ์โค้ดเฉลยเด็ดขาด กระตุ้นให้นักเรียนแก้ปัญหาด้วยตนเอง
    `;
  }

  return ` 
    Evaluate the student's Python program based on the following information:
    Exercise Title: "${exercise.title}"
    Exercise Description (GROUND TRUTH / PRIMARY SPECIFICATION): "${exercise.description}"
    Topic: "${exercise.topic}"
    Objective/Rubric: "${exercise.objective}"
    
    Student's Source Code:
    "${sourceCode}"
    
    Execution Output from Sandbox:
    - Status: ${runResult.status}
    - Output: ${runResult.stdout || 'None'}
    - Error: ${runResult.stderr || 'None'}

    CRITICAL EVALUATION PRINCIPLE (Strict Description-First):
    - The "Exercise Description" is the ABSOLUTE GROUND TRUTH and PRIMARY SPECIFICATION of what the student must accomplish.
    - The "Exercise Title" and "Topic" are only general categorization labels. You MUST NOT use the title to loosen, alter, or override the explicit requirements written in the Exercise Description.
    - Evaluate whether the student's output and logic satisfy the exact requirements of the "Exercise Description".
    - In your Socratic feedback (ai_feedback), always guide the student by referring strictly to the requirements described in the Exercise Description (คำอธิบายโจทย์).

    Additional rules to evaluate (use these criteria):
    [Correctness Check - Deterministic Scoring Rubric]:
    Evaluate the student's code and execution output strictly based on the requirements in the 'Exercise Description':
    - Full Score (100 points): The printed output or program logic completely satisfies what is specified in the Exercise Description.
    - Minor Formatting Discrepancy (70 points): The target concept and message are present, but with minor case differences (e.g. "welcome to python" vs "Welcome to Python") or trailing whitespace differences.
    - Wrong Output / Different String / Crash (0 points): The output content does not match what the Exercise Description specifies (for example, printing "Hello World!" when the Exercise Description requires "Welcome to Python", or incorrect mathematical result, or runtime error). You MUST award 0 points deterministically in these cases (do NOT award partial credit for completely different strings).
    [Adaptive Hints Framework] ${adaptiveHintsRules}
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
      -  [PROHIBITED] (Direct / Blunt): "ต้องใช้ int(input()) แปลงตัวเลขก่อนนำมาบวกกันครับ"
      -  [DESIRED] (Polite & Socratic Hint): "เขียนโค้ดได้เป็นระเบียบดีแล้วครับ ลองสังเกตเพิ่มเติมดูนะครับว่าตัวแปรที่รับเข้ามาพร้อมสำหรับการคำนวณทางคณิตศาสตร์แล้วหรือยังครับ?"

    Example 2 (Typo or slight mismatch in terminal output):
      -  [PROHIBITED] (Direct / Blunt): "ยังผิดครับ ต้อง print คำว่า 'Total: ' ไม่ใช่ 'Sum: '"
      -  [DESIRED] (Polite & Socratic Hint): "เกือบสมบูรณ์แล้วครับ ลองตรวจสอบและเปรียบเทียบข้อความที่แสดงใน Terminal กับรูปแบบผลลัพธ์ที่โจทย์กำหนดดูอีกนิดนะครับว่ามีคำใดที่ยังไม่ตรงกันบ้างครับ"

    Example 3 (Loop condition or Off-by-one error):
      -  [PROHIBITED] (Direct / Blunt): "ลูปขาดไปหนึ่งรอบ ให้แก้เป็น range(1, n + 1) ครับ"
      -  [DESIRED] (Polite & Socratic Hint): "มีความพยายามที่ดีมากครับ ลองสังเกตรอบสุดท้ายของการวนลูปดูอีกนิดนะครับว่าค่าตัวนับไปถึงตัวเลขเป้าหมายตามที่โจทย์ต้องการครบถ้วนแล้วหรือยังครับ?"

    Example 4 (Runtime Error / Exception occurred):
      -  [PROHIBITED] (Direct / Blunt): "เกิด ZeroDivisionError ให้ใส่ if b != 0: ดักไว้ก่อนหาร"
      -  [DESIRED] (Polite & Socratic Hint): "ไม่ต้องกังวลกับข้อผิดพลาดนะครับ ลองตรวจสอบสาเหตุของข้อผิดพลาดใน Console ดูครับว่ามีตัวหารหรือค่าใดที่ทำให้โปรแกรมไม่สามารถคำนวณต่อได้ครับ?"
    ====================================================

    ====================================================
    CRITICAL INSTRUCTIONS FOR RESPONSE (JSON ONLY):
    Return a JSON object ONLY. Do not write any conversational intro, greetings, warnings, markdown wrappers, or outros.
    
    - For "score": <overall evaluation score as an integer from 0 to 100>,
    - For "exception_message": If a compilation or runtime error occurred, provide only the short name/type of the exception (e.g. "ValueError" or "SyntaxError"). Do not explain the exception. If no error occurred, use null.
    - For "ai_feedback": ให้ตอบเป็นข้อความภาษาไทยปกติที่เป็นธรรมชาติ สุภาพ นุ่มนวล กระชับ (1-2 ประโยค ไม่เกิน 40 คำ) โดยใช้เทคนิค Socratic Method (ถามนำกระตุ้นคิด ไม่เฉลยคำตอบ):
      * [น้ำเสียงและมารยาทที่เคร่งครัด] ต้องใช้ระดับภาษาที่สุภาพ ให้เกียรติ และให้กำลังใจผู้เรียนเสมอ ต้องลงท้ายประโยคด้วยคำสุภาพ ("ครับ" หรือ "นะครับ") ห้ามใช้น้ำเสียงห้วน สั่งการ หรือตำหนิผู้เรียนเด็ดขาด
      * [กฎเหล็กเด็ดขาด] ห้ามเฉลยคำตอบ ห้ามบอกโค้ดที่ถูกต้อง ห้ามเขียนโค้ดตัวอย่าง และห้ามบอกวิธีแก้ตรงๆ (เช่น ห้ามพูดว่า "ควรเปลี่ยน X เป็น Y" หรือ "ให้ใช้ฟังก์ชัน Z")
      * หากโค้ดยังไม่ผ่านเกณฑ์: ให้เปิดด้วยคำชื่นชมหรือให้กำลังใจในความพยายาม แล้วบอกใบ้แบบอ้อมๆ โดยตั้งคำถามชี้นำ (Guiding Question) ชวนให้นักเรียนสังเกตจุดที่ต้องวิเคราะห์ด้วยตนเอง เช่น:
        - กรณีข้อความหรือผลลัพธ์ไม่ตรง: "เกือบสมบูรณ์แล้วครับ ลองตรวจสอบและเปรียบเทียบข้อความที่แสดงใน Terminal กับรูปแบบที่โจทย์ระบุดูอีกนิดนะครับว่ามีจุดใดต่างกันบ้างครับ"
        - กรณีชนิดข้อมูลหรือตัวแปรผิด: "โครงสร้างโค้ดดีแล้วครับ ลองสังเกตชนิดข้อมูลของตัวแปรที่รับเข้ามาก่อนนำไปประมวลผลดูนะครับว่าพร้อมสำหรับการคำนวณแล้วหรือยังครับ"
        - กรณีตรรกะหรือลูปไม่ครบ: "มีความพยายามที่ดีมากครับ ลองสังเกตรอบสุดท้ายของการทำงานหรือเงื่อนไขตรวจสอบดูนะครับว่าครอบคลุมกรณีที่โจทย์ต้องการครบถ้วนหรือไม่ครับ"
      * หากโค้ดทำงานถูกต้องเรียบร้อยแล้ว: ให้ตอบชื่นชมอย่างอบอุ่นและชวนคิดต่อยอด เช่น "ยอดเยี่ยมมากครับ โค้ดทำงานถูกต้องและเรียบร้อยดีแล้วครับ ลองคิดดูว่ามีแนวทางใดที่ช่วยให้โค้ดอ่านง่ายหรือกระชับขึ้นได้อีกบ้างครับ"
      * เน้นประโยคคำถามชี้นำที่สุภาพและกระตุ้นการคิดวิเคราะห์ ความยาว 1-2 ประโยคกระชับที่สุด

    The response must exactly follow this JSON schema:
    {
      "score": <overall evaluation score as an integer from 0 to 100>,
      "exception_message": "<extremely short exception type or null>",
      "ai_feedback": "<extremely polite, courteous, encouraging Socratic Thai hint sentence ending with ครับ/นะครับ (max 40 words)>"
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
      // รองรับชื่อฟิลด์คำแนะนำที่หลากหลายจากโมเดล AI แต่ละค่าย (ai_feedback, feedback, hint, message)
      const rawFeedback =
        parsed.ai_feedback ??
        parsed.feedback ??
        parsed.hint ??
        parsed.message ??
        null;

      return {
        score: typeof parsed.score === 'number' ? parsed.score : defaultScore,
        exception_message: parsed.exception_message ?? null,
        ai_feedback: sanitizeAiFeedback(rawFeedback),
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

      // ตรวจจับชื่อฟิลด์ข้อเสนอแนะทุกรูปแบบผ่าน Regex กรณี JSON มี syntax หลุด
      const feedbackMatch = cleanText.match(
        /"(?:ai_feedback|feedback|hint|message)"\s*:\s*"((?:[^"\\]|\\.)*)"/,
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

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
      - Provide only high-level conceptual hints. Do not specify line numbers or point to the exact errors. Do not write any code solutions or code snippets under any circumstances.
    `;
  } else if (runCount <= 4) {
    hintLevelInstruction = `
      - Identify the general category of the logical error and narrow down the scope of the erroneous code block. Still, do not write code solutions for the user.
    `;
  } else {
    hintLevelInstruction = `
      - Point to the exact line numbers of the errors. Explain the root causes of the bugs clearly. You are allowed to provide code examples or refactoring suggestions to guide them.
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
    [Correctness Check] Evaluate the student's code and execution output based on its proximity/closeness to the requirements described in the 'Exercise Description'. If the printed output or logic is completely correct, award a score of 100. If it is partially correct (e.g., minor typos, case mismatch such as printing "Hello Python" or "hello python" instead of "Welcome to Python", or slightly incorrect output format), deduct some score proportionally (e.g. award a partial score like 50 to 80 points) and explain in the feedback what is slightly incorrect. Give a score of 0 only if the output or logic is completely wrong, unrelated, or failed to compile/run.
    [Security Check] ${securityRules}
    [Complexity/Big-O Check] ${complexityRules}
    [PEP 8 Cleanliness Check] ${pep8Rules}
    [Edge Cases Check] ${edgeCasesRules}
    [Dynamic Rubric Check] ${dynamicRubricRules}
    
    Hint rules you MUST follow for this run count:
    ${hintLevelInstruction}

    ====================================================
    CRITICAL INSTRUCTIONS FOR RESPONSE (JSON ONLY):
    Return a JSON object ONLY. Do not write any conversational intro, greetings, warnings, markdown wrappers, or outros.
    
    - For "score": <overall evaluation score as an integer from 0 to 100>,
    - For "exception_message": If a compilation or runtime error occurred, provide only the short name/type of the exception (e.g. "ValueError" or "SyntaxError"). Do not explain the exception. If no error occurred, use null.
    - For "ai_feedback": ให้ตอบเป็นข้อความประโยคภาษาไทยปกติที่เป็นธรรมชาติและกระชับในการแนะนำผู้เรียน (ห้ามตอบเป็นหัวข้อขีดลบภาษาอังกฤษเด็ดขาด)
      * หากโค้ดยังไม่ผ่านเกณฑ์ หรือทำเงื่อนไขไม่ครบตามโจทย์: ให้ระบุจุดที่บกพร่องตรงๆ โดยขึ้นต้นประโยคทำนองว่า "ยังทำไม่ครบตามโจทย์..." หรือ "ควรปรับปรุงโค้ดส่วน..." แล้วตามด้วยคำแนะนำที่สั้นและกระชับ
      * หากโค้ดทำงานถูกต้องเรียบร้อยแล้ว: ให้ตอบชื่นชมสั้นๆ และเสนอแนะจุดที่พัฒนาเพิ่มเติมได้ เช่น "โค้ดถูกต้องและทำงานได้ดีครับ แต่ควรเพิ่ม comment เพื่อความอ่านง่ายขึ้น"
      * ให้ควบคุมความยาวใหอยูในช่วง 1-2 ประโยคสั้นๆ กระชับและได้ใจความที่สุด

    The response must exactly follow this JSON schema:
    {
      "score": <overall evaluation score as an integer from 0 to 100>,
      "exception_message": "<extremely short exception type or null>",
      "ai_feedback": "<highly concise, friendly Thai feedback sentence (max 30 words)>"
    }
  `;
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
        ai_feedback: parsed.ai_feedback ?? null,
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
        ai_feedback: ai_feedback || null,
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

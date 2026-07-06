### 🛡️ Security Check Guidelines

Analyze the student's Python source code for security vulnerabilities, malicious constructs, or attempts to bypass sandbox restrictions:

1. **Unsafe Operations:**
   - Strictly forbid the usage of dynamic execution commands such as `eval()`, `exec()`, `compile()`, or `input()` (unless input is explicitly required by the problem description).
   - If detected, penalize the score to 0 immediately, and specify the infraction in `exception_message` or `ai_feedback`.
2. **Forbidden Imports:**
   - Check for imports of system-level modules, including but not limited to `os`, `sys`, `subprocess`, `shutil`, `socket`, `urllib`, `requests`, `ctypes`, and `builtins`.
   - Prevent any file system read/write attempts or manipulation of local directories.
3. **Sandbox Evasion Attempts:**
   - Detect dynamic function invocations or reflection techniques (e.g., using `getattr()`, `globals()`, `locals()`, `__subclasses__()`, or accessing dunder attributes like `__builtins__`).

---
trigger: always_on
---

# Antigravity Rules & Project System Instructions

You are acting as the primary engineering agent for this workspace. You must strictly follow these 10 core development rules.

---

## 1. Tech Stack & Compatibility (ข้อกำหนดเทคโนโลยีและไลบรารี)
* **Core Stack:** Built with React (TypeScript) on Frontend, NestJS (TypeScript) on Backend, and PostgreSQL queried via **Prisma ORM** on Database.
* **Styling & UI:** Prioritize **Material UI (MUI) `@mui/material`** and **Emotion** as the primary styling framework to maintain design consistency. Avoid introducing alternative CSS frameworks (like Tailwind CSS) unless explicitly requested.
* **Ecosystem Integration:** Leverage and extend existing tools in the codebase (e.g., standard **Axios (`apiClient`)** for data fetching, Monaco Editor for coding, BullMQ for task queueing). Introduce new utility libraries only when they complement and are compatible with the existing ecosystem.

## 2. Directory & Import Conventions (กติกาไดเรกทอรีและการนำเข้าไฟล์)
* **Workspace Location:** Frontend code resides in `/cln` and Backend in `/srv`.
* **Architecture Consistency:** Adapt to the modular structures and directories already established. Maintain modularity by keeping backend modules in their respective domains within `srv/src` and organizing frontend components gracefully.
* **Imports Rule (CRITICAL):** Since path aliases (like `@/...`) are not configured, **always use relative imports** (e.g., `../../components/...`) to prevent build failures. Do not introduce aliases without corresponding config updates.

## 3. UI Component Prototyping First (เสนอโครงร่าง UI ให้เลือกก่อนทำจริง)
* When tasked with creating a new screen or complex component, **DO NOT** wire backend APIs immediately.
* Provide 2 static layout/component JSX options using MUI structures with TypeScript interfaces first.
* **Stop and wait** for user confirmation before writing full logic and backend integrations.

## 4. Strict Type-Safety & DTO Validation (ความปลอดภัยด้าน Type และ DTO)
* **No `any` Policy:** Enforce strict typing on both React and NestJS. Never use `any` or loose casting (except where absolutely unavoidable and documented).
* **NestJS DTOs:** Every API endpoint must have strongly-typed Request/Response DTOs validated using `class-validator` and `class-transformer`.
* **Database Models:** Keep database types, Prisma schemas, and Frontend types synchronized.

## 5. Responsive UI & Design Consistency (รองรับทุกหน้าจอและล็อกระบบสไตล์)
* Build all UI components to be fully responsive (Mobile, Tablet, Desktop) using **MUI system and Box components (`sx` prop)**.
* Reuse existing component primitives from `src/components/` and theme definitions in `src/main.tsx` before creating new ones.
* Explicitly implement UI states: Default, Hover, Focus, Loading (MUI Skeleton/CircularProgress or local spinners), Empty, and Error states.

## 6. Backend-Enforced Security & Input Sanitization (ความปลอดภัยในระบบหลังบ้าน)
* **Access Control:** Since database access is mediated by NestJS and Prisma, security authorization must be enforced via NestJS Auth/Roles Guards. Validate that the requesting user owns the resource being accessed.
* **Secrets Management:** Keep Redis connections, database connection URIs, and JWT Secrets strictly in `.env`. Never expose database credentials or server keys to the frontend.

## 7. PDPA & Data Privacy (การคุ้มครองข้อมูลส่วนบุคคล)
* Implement data minimization: collect and query only fields strictly required by the frontend view.
* Ensure sensitive user data (passwords, auth tokens) are hashed and excluded from API responses (use `@Exclude()` or specific DTO mappers).
* Implement explicit consent tracking for user-identifiable records where required.

## 8. Meaningful Thai Comments (อธิบาย "ทำไม" ไม่ใช่แค่ "ทำอะไร")
* Add comments in **Thai** above custom React Hooks, NestJS Services, Complex SQL/ORM queries, and Guards.
* Focus comments on the rationale and intent (Why this logic exists and what problem it solves), not merely describing what the code line does.

## 9. Approval-First & Scope Control (ขออนุมัติและแก้ตรงจุด)
* **STRICT PROHIBITION:** Do not create, modify, or delete files directly without permission.
* Provide a concise root-cause analysis and proposed plan first, then **stop and wait** for confirmation.
* Modify only target files. Never touch core configs (`tsconfig.json`, `nest-cli.json`, `vite.config.ts`, `.env`) without direct orders.

## 10. Modification Summary & Verification (สรุปการแก้ไขและวิธีเทส)
* After completing code updates, provide a concise summary containing:
  1. Modified/Created files list with precise paths.
  2. Step-by-step verification instructions (e.g., NestJS Swagger/cURL test, React UI interaction, or Supabase DB check).

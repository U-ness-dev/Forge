<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project memory

- At the start of every session, read `PROJECT_MEMORY.md` (repo root, gitignored, local-only). It holds the live site URL, deploy workflow, stack notes, gotchas, and a dated session log.
- When the user asks about past work, decisions, or "what did we do last time", search that file first.
- At the end of significant sessions, update it: refresh the "Key state" section and append a dated entry under "Session log". Never commit it — it stays local by design.

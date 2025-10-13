# Health4All

Health4All helps users monitor their daily health activities through an interactive dashboard.

---

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express (TypeScript)
- ORM / DB: Drizzle (SQLite by default)
- Tooling: tsx for running TypeScript, dotenv for environment variables

---

## Quick Start (Local)

1. **Download & unzip** the project files (or clone the repo if pushed to GitHub).
2. Install dependencies:
```bash
npm install
```

3. Run the development server (both frontend and backend live in this project):
```bash
npm run dev
```

4. Start for production (run compiled or use `npm start`):
```bash
npm start
```

5. The backend API runs on `http://localhost:3000` by default and exposes routes under `/api`.

---

## Environment Variables

Create a `.env` file in the project root (if not present) and add any of the following as needed:

```
PORT=3000
# Drizzle (SQLite) uses local file by default; for other DBs use DATABASE_URL
# DATABASE_URL=sqlite:./data.db
```

---

## Database

This project uses **Drizzle ORM** configured for **SQLite** by default (see `drizzle.config.ts`). The DB file is `data.db` in the project root/server folder. To switch DBs, update `drizzle.config.ts` and supply an appropriate `DATABASE_URL`.

---

## Project Structure (top-level files & important folders)
```
.gitignore
.replit
components.json
design_guidelines.md
drizzle.config.ts
package-lock.json
package.json
postcss.config.js
replit.md
tailwind.config.ts
tsconfig.json
vite.config.ts

public/
src/
README_FOR_GITHUB.md
```

For a more complete listing, check the `src/` and `public/` folders after extracting the archive.

---

## Commands reference
- Install: `npm install`
- Dev (watch + run): `npm run dev`
- Start (production): `npm start`
- Build TypeScript: `npm run build`

---

## Notes before publishing to GitHub
- The packaged zip is cleaned of any embedded `.git/` history to avoid nested git issues. You can upload the contents directly to a new GitHub repo or clone the repo locally and push.
- If you want me to push to GitHub, I cannot push from this environment — but I can prepare everything and give you precise push commands.

---

If you'd like, I can also:
- Add screenshots placeholders, badges, or a more-detailed Features section.
- Generate a sample `.env.example` and add instructions for migrations.
- Create a `CONTRIBUTING.md` or `LICENSE` file.


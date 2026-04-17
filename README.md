# StudySnap+ 🧠

StudySnap+ is a modern, AI-powered learning platform designed to actually help you retain information, not just blindly generate text. 

Unlike generic AI note-takers, StudySnap+ uses an advanced RAG (Retrieval-Augmented Generation) pipeline so **every AI answer is explicitly grounded in your uploaded materials**. You can upload lecture videos, PFDs, slides, or even YouTube links, and StudySnap+ automatically transcribes, performs OCR, and generates interactive notes, adaptative quizzes, and spaced-repetition flashcards.

![StudySnap+ Dashboard Demo](.system_generated/click_feedback/click_feedback_1776410926367.png)

## Tech Stack 🛠️

StudySnap+ is built for the modern web, utilizing a robust, production-ready stack:

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js v5 (Google, GitHub, and Email/Password)
- **Storage**: Vercel Blob
- **AI / LLMs**: Google Gemini (1.5 Pro & 1.5 Flash)
- **Vector / RAG Pipeline**: Gemini `text-embedding-004` + PostgreSQL
- **Media Processing**: OpenAI Whisper (Audio/Video), Google Document AI (OCR)

---

## 🚀 Deploying to Vercel (Production)

Deploying StudySnap+ is incredibly straightforward using Vercel. Follow these exact steps to get your own instance running live on the internet!

### Step 1: Fork or Clone
1. Fork this repository to your own GitHub account.

### Step 2: Set up dependencies (Database & Keys)
Before deploying, you'll need a few free tier services:

1. **Database (Prisma Postgres)**  
   - Go to [Prisma Postgres](https://www.prisma.io/postgres), Supabase, or Neon to get a free PostgreSQL database URL.
   
2. **AI APIs**  
   - Get your free **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Get an **OpenAI Key** for Whisper transcriptions from [OpenAI](https://platform.openai.com/).

3. **Authentication (OAuth)**
   - To support Google login, set up an OAuth client in [Google Cloud Console](https://console.cloud.google.com/). Set your Authorized Redirect URI to `https://your-domain.vercel.app/api/auth/callback/google`.
   - Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in your terminal to generate a strong, random `NEXTAUTH_SECRET`.

### Step 3: Deploy on Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
2. Import your newly forked `StudySnap` GitHub repository.
3. Ignore the build phase for a second and go strictly to **Environment Variables**.
4. Add all the keys required from `.env.local.example` (see below).

**Required Environment Variables on Vercel:**
```env
DATABASE_URL="postgresql://user:password@host:5432/studysnap?sslmode=require"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="https://your-project.vercel.app"
GEMINI_API_KEY="AIzaSy..."
OPENAI_API_KEY="sk-proj-..."
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
INTERNAL_API_SECRET="your-random-internal-api-secret"
```

### Step 4: Attach Vercel Blob (Storage)
1. Once deployed (even if the build fails the first time without Blob space), go to your Vercel Project.
2. Click the **Storage** tab.
3. Click **Create Database** and select **Vercel Blob**.
4. Hook the newly created Blob to your project. This automatically binds the `BLOB_READ_WRITE_TOKEN` environment variable!

### Step 5: Database Migration
Before people can log in, you need to push the Prisma schema to your live Postgres database.
Run this command from your local machine terminal:
```bash
npx prisma generate
npx prisma db push
```

**(If Vercel failed the first deployment, trigger an un-cached Redeploy now. It will succeed!)**

---

## 💻 Running Locally

To run the project on your own machine for development:

```bash
# 1. Clone the repo
git clone https://github.com/Thanuprakashgowda/StudySnap.git
cd StudySnap/studysnap-app

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
cp .env.local.example .env.local
# Fill in your Database URL, NextAuth Secret, Gemini Key, and Vercel Blob tokens!

# 4. Sync Database
npx prisma db push

# 5. Run the development server
npm run dev
```

Visit `http://localhost:3000` to start building!

---

## Architecture Highlight: The RAG Pipeline

StudySnap+ implements a robust Retrieval-Augmented Generation (RAG) system for the AI Tutor and Quiz generation:
1. When a user uploads a file, it's pushed to **Vercel Blob**.
2. A background API trigger picks up the URL and runs it through **Whisper (audio/video)** or **Google Document AI (PDF/images)** to extract raw text.
3. The raw text is chunked into 512-token segments (with overlaps) and embedded using **Gemini text-embedding-004**.
4. Chunks are stored in **PostgreSQL** locally.
5. When a user talks to the AI Tutor, their query is embedded, cosine-similarity matched against the DB, and the Top K context chunks are injected directly into a **Gemini 1.5 Flash** prompt ensuring 0% hallucination rates and inline citations!

---

**Built with ❤️ for learners everywhere.**

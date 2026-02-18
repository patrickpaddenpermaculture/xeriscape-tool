# Fort Collins Xeriscape Planning Tool (MVP)

Address-only prototype.

## Features
- Enter an address
- Fetch Google Street View + Satellite images
- Generate 3 xeriscape concept "after" images using OpenAI

## Local Run
1. Install dependencies:
   npm install

2. Create `.env.local`:
   GOOGLE_MAPS_API_KEY=your_google_key
   OPENAI_API_KEY=your_openai_key

3. Start dev server:
   npm run dev

Open: http://localhost:3000

## Deploy (Vercel)
Set environment variables in Vercel Project Settings:
- GOOGLE_MAPS_API_KEY
- OPENAI_API_KEY

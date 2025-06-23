# HOME Music Creator Roadmap Quiz

AI-powered quiz to help music creators find their personalized pathway at HOME for Music.

## Features

- 🎯 AI-powered personalized pathway recommendations
- 🏡 Integration with HOME's community framework
- 📧 Automatic lead capture to Go High Level
- 📱 Mobile-first responsive design
- ⚡ Fast deployment with Vercel + GitHub

## Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/home-quiz-mvp.git
cd home-quiz-mvp
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your actual API keys
```

4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the quiz.

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for AI-powered pathway generation
- `GHL_WEBHOOK_URL`: Go High Level webhook URL for lead capture

## Deployment

This project is configured for automatic deployment via Vercel + GitHub integration.

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

## Project Structure

- `/app` - Next.js app directory with main pages
- `/components` - React components (quiz interface)
- `/pages/api` - API routes for OpenAI and GHL integration
- Configuration files for Next.js, Tailwind, etc.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 API
- **CRM**: Go High Level integration
- **Deployment**: Vercel
- **Version Control**: GitHub
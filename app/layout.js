import './globals.css'

export const metadata = {
  title: 'Find Your Path | HOME for Music',
  description: 'AI-powered quiz to discover your personalized music creator roadmap with Nashville\'s most supportive music community.',
  keywords: 'music creator, Nashville, music community, artist development, music career',
  authors: [{ name: 'HOME for Music' }],
  openGraph: {
    title: 'Find Your Path on the Music Creator Roadmap',
    description: 'Take our AI-powered quiz to discover your personalized pathway in the music industry.',
    url: 'https://quiz.homeformusic.org',
    siteName: 'HOME for Music',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Path | HOME for Music',
    description: 'AI-powered quiz to discover your music creator roadmap',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}
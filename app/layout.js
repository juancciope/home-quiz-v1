import './globals.css'

export const metadata = {
  title: 'Find Your Path | HOME for Music',
  description: 'AI-powered quiz to discover your personalized music creator roadmap with Nashville\'s most supportive music community.',
  keywords: 'music creator, Nashville, music community, artist development, music career',
  authors: [{ name: 'HOME for Music' }],
  metadataBase: new URL('https://quiz.homeformusic.org'),
  alternates: {
    canonical: 'https://quiz.homeformusic.org',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Find Your Path on the Music Creator Roadmap',
    description: 'Take our AI-powered quiz to discover your personalized pathway in the music industry.',
    url: 'https://quiz.homeformusic.org',
    siteName: 'HOME for Music',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HOME for Music - Find Your Path',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Path | HOME for Music',
    description: 'AI-powered quiz to discover your music creator roadmap',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}
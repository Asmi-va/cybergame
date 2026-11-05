import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Syne } from 'next/font/google'
import './globals.css'

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const display = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'SafeRon — Digital Safety Academy',
    template: '%s · SafeRon',
  },
  description:
    'SafeRon Academy — Learn · Trust · Verify. Cyber-safety for ages 8–16 in India: courses, practice, story missions, and printable certificates.',
  applicationName: 'SafeRon',
  openGraph: {
    title: 'SafeRon — Digital Safety Academy',
    description: 'Learn · Trust · Verify. One interactive academy for Indian learners.',
    type: 'website',
    images: [{ url: '/og-saferon.png', width: 1200, height: 630, alt: 'SafeRon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafeRon — Digital Safety Academy',
    description: 'Learn · Trust · Verify. Cyber-safety academy for ages 8–16.',
    images: ['/og-saferon.png'],
  },
  icons: {
    icon: [
      { url: '/saferon-logo.png', type: 'image/png' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#090909' }],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased">
        {children}
        {/* Opt-in only — child privacy default is no analytics. Set NEXT_PUBLIC_ENABLE_ANALYTICS=1 to enable. */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === '1' && <Analytics />}
      </body>
    </html>
  )
}

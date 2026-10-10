import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n/request';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/Toaster';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Huanlejia Indonesia · Premium Coconut Products',
  description:
    'PT. Prima Coco Indonusa — premium coconut water, milk, desiccated coconut and virgin coconut oil from Indonesia. Part of Huanlejia Food Group (300997.SZ).',
  openGraph: {
    title: 'Huanlejia Indonesia · Premium Coconut Products',
    description:
      'Premium coconut ingredients from Indonesia, backed by Huanlejia Food Group.',
    type: 'website',
    url: 'https://id.gdhlj.com',
    siteName: 'Huanlejia Indonesia',
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body className="font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
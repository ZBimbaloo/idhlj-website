import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Huanlejia Indonesia · Premium Coconut Products',
    template: '%s · Huanlejia Indonesia',
  },
  description:
    'PT. Prima Coco Indonusa — premium coconut water, coconut milk, desiccated coconut and virgin coconut oil from Indonesia. Part of Huanlejia Food Group.',
  metadataBase: new URL('https://id.gdhlj.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://id.gdhlj.com',
    siteName: 'Huanlejia Indonesia',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
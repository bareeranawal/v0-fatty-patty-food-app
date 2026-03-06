import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { CartProvider } from '@/lib/cart-context'
import { OrderProvider } from '@/lib/order-context'
import { UserProvider } from '@/lib/user-context'
import { AdminProvider } from '@/lib/admin-context'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins' })

export const metadata: Metadata = {
  title: 'Fatty Patty | Original Taste - Premium Burgers Since 2020',
  description: 'Premium smashed burgers, loaded fries and signature bowls. Order online for delivery or pickup from Fatty Patty - Karachi\'s favorite burger spot.',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#C1121F',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <OrderProvider>
            <UserProvider>
              <AdminProvider>
                <CartProvider>
                  {children}
                  <WhatsAppButton />
                  <Toaster position="bottom-right" richColors />
                </CartProvider>
              </AdminProvider>
            </UserProvider>
          </OrderProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

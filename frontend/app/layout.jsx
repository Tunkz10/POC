import './globals.css'

export const metadata = {
  title: 'Customer Portal',
  description: 'View your bookings and messages',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


import './globals.css';

export const metadata = {
  title: "Qcode",
  description: "Create and share engaging quizzes with QCode",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
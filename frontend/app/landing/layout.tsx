import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer/Footer';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
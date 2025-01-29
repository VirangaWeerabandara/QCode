import Banner from '../landing/Banner';
import Companies from '../landing/Companies/Companies';
import Courses from '../landing/Courses';
import Mentor from '../landing/Mentor';
import Testimonials from '../landing/Testimonials';
import Newsletter from '../landing/Newsletter/Newsletter';

export default function Home() {
  return (
    <main>
      <Banner />
      <Companies />
      <Courses />
      <Mentor />
      <Testimonials />
      <Newsletter />
    </main>
  )
}
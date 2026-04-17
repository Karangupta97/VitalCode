import { Link } from 'react-router-dom'
import Footer from '../components/landing/Footer'
import Navbar from '../components/landing/Navbar'

const InfoPage = ({ title, description }) => {
  return (
    <div className='min-h-screen bg-(--ms-bg)'>
      <Navbar />
      <main className='px-5 py-16 md:px-8 md:py-24'>
        <div className='mx-auto w-full max-w-4xl rounded-[2rem] border border-(--ms-border) bg-white/80 p-8 shadow-(--ms-shadow) backdrop-blur md:p-12'>
          <p className='text-sm font-semibold uppercase tracking-[0.16em] text-(--ms-primary)'>Medicare Secure</p>
          <h1 className='mt-3 text-3xl font-semibold tracking-tight text-(--ms-ink) md:text-5xl'>{title}</h1>
          <p className='mt-5 text-base text-(--ms-muted) md:text-lg'>{description}</p>

          <div className='mt-8 flex flex-wrap gap-3'>
            <Link
              to='/'
              className='rounded-full bg-(--ms-primary) px-6 py-3 text-sm font-semibold text-white transition hover:bg-(--ms-primary-strong)'
            >
              Back to Home
            </Link>
            <Link
              to='/contact'
              className='rounded-full border border-(--ms-border) bg-white px-6 py-3 text-sm font-semibold text-(--ms-ink) transition hover:border-(--ms-primary) hover:text-(--ms-primary)'
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default InfoPage

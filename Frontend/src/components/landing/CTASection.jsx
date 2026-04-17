import { Link } from 'react-router-dom'

const CTASection = () => {
  return (
    <section className='px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto w-full max-w-7xl rounded-[2rem] border border-(--ms-border) bg-gradient-to-br from-teal-600 to-sky-600 p-8 text-white shadow-2xl shadow-sky-900/20 md:p-12'>
        <h2 className='text-3xl font-semibold tracking-tight md:text-4xl'>Join the Future of Secure Healthcare</h2>
        <p className='mt-3 max-w-2xl text-sm text-sky-100 md:text-base'>
          Launch trusted digital healthcare journeys with verified identities, resilient data protection,
          and AI-governed operations.
        </p>
        <div className='mt-6 flex flex-wrap gap-3'>
          <Link
            to='/contact'
            className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100'
          >
            Get Started Today
          </Link>
          <Link
            to='/services'
            className='rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10'
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTASection

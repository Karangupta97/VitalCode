import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='relative overflow-hidden px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute -left-24 top-0 h-64 w-64 rounded-full bg-emerald-300/45 blur-3xl' />
        <div className='absolute right-0 top-14 h-72 w-72 rounded-full bg-sky-300/50 blur-3xl' />
      </div>

      <div className='mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]'>
        <div>
          <p className='inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-(--ms-primary)'>
            Trusted by modern healthcare teams
          </p>
          <h1 className='mt-5 text-4xl font-semibold leading-tight tracking-tight text-(--ms-ink) sm:text-5xl md:text-6xl'>
            Securing the Future of Digital Healthcare
          </h1>
          <p className='mt-5 max-w-2xl text-base text-(--ms-muted) md:text-lg'>
            Medicare Secure protects hospitals, clinics, and pharmacies against doctor impersonation,
            prescription fraud, and clinical data tampering with defense-grade cybersecurity workflows.
          </p>
          <div className='mt-8 flex flex-wrap gap-3'>
            <Link
              to='/contact'
              className='rounded-full bg-(--ms-primary) px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-teal-900/20 transition hover:bg-(--ms-primary-strong)'
            >
              Start Secure Deployment
            </Link>
            <Link
              to='/security'
              className='rounded-full border border-(--ms-border) bg-white/75 px-6 py-3 text-sm font-semibold text-(--ms-ink) transition hover:border-(--ms-primary) hover:text-(--ms-primary)'
            >
              Explore Security Stack
            </Link>
          </div>
        </div>

        <div className='relative'>
          <div className='rounded-3xl border border-white/60 bg-white/70 p-5 shadow-(--ms-shadow) backdrop-blur md:p-7'>
            <div className='rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 p-6 text-white md:p-8'>
              <p className='text-xs uppercase tracking-[0.2em] text-cyan-200'>Live Security Map</p>
              <h3 className='mt-3 text-2xl font-semibold tracking-tight'>Healthcare Threat Control</h3>
              <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                <div className='rounded-2xl border border-cyan-200/25 bg-white/10 p-4'>
                  <p className='text-sm text-cyan-100'>Identity Integrity</p>
                  <p className='mt-1 text-2xl font-semibold'>99.98%</p>
                </div>
                <div className='rounded-2xl border border-cyan-200/25 bg-white/10 p-4'>
                  <p className='text-sm text-cyan-100'>Rx Validation Speed</p>
                  <p className='mt-1 text-2xl font-semibold'>Sub-second</p>
                </div>
                <div className='rounded-2xl border border-cyan-200/25 bg-white/10 p-4 sm:col-span-2'>
                  <p className='text-sm text-cyan-100'>Active protections</p>
                  <div className='mt-2 grid grid-cols-3 gap-2 text-center text-xs font-medium text-cyan-100'>
                    <span className='rounded-lg bg-cyan-400/20 py-2'>Identity Shield</span>
                    <span className='rounded-lg bg-cyan-400/20 py-2'>Rx Guard</span>
                    <span className='rounded-lg bg-cyan-400/20 py-2'>Data Seal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

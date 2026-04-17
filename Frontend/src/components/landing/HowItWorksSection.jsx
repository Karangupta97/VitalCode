const steps = [
  { title: 'Upload data', detail: 'Intake prescription and clinical records through secure APIs or portal.' },
  { title: 'Verify identity', detail: 'Authenticate Aadhaar and doctor credentials with layered checks.' },
  { title: 'Secure storage', detail: 'Encrypt and anchor records in tamper-resistant storage systems.' },
  { title: 'AI monitoring', detail: 'Continuously monitor workflow behavior and trigger policy controls.' },
  { title: 'Verified access', detail: 'Allow access only after real-time validation and consent checks.' },
]

const HowItWorksSection = () => {
  return (
    <section className='px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto w-full max-w-7xl'>
        <p className='text-sm font-semibold uppercase tracking-[0.16em] text-(--ms-primary)'>How It Works</p>
        <h2 className='mt-3 text-3xl font-semibold tracking-tight text-(--ms-ink) md:text-4xl'>
          Built for speed, trust, and regulatory confidence
        </h2>

        <div className='mt-8 grid gap-4 md:grid-cols-5'>
          {steps.map((step, index) => (
            <article
              key={step.title}
              className='rounded-3xl border border-(--ms-border) bg-white/75 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
            >
              <p className='text-sm font-semibold text-(--ms-primary)'>Step {index + 1}</p>
              <h3 className='mt-2 text-lg font-semibold text-(--ms-ink)'>{step.title}</h3>
              <p className='mt-2 text-sm text-(--ms-muted)'>{step.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection

const features = [
  {
    title: 'End-to-End Encryption',
    text: 'Protect patient records and prescriptions in transit and at rest with strong cryptography.',
  },
  {
    title: 'Tamper-proof Audit Logs',
    text: 'Every action is captured with immutable, verifiable event trails for compliance readiness.',
  },
  {
    title: 'Doctor Identity Verification',
    text: 'Link credentials to verified providers to prevent impersonation and unauthorized access.',
  },
  {
    title: 'AI Fraud Detection',
    text: 'Continuously scan behavior and transactions to identify anomalies before impact occurs.',
  },
  {
    title: 'Secure Cloud Storage',
    text: 'Store critical healthcare data in hardened cloud architecture with strict policy controls.',
  },
  {
    title: 'Real-time Monitoring',
    text: 'Observe access, prescriptions, and API events with unified dashboards and instant alerts.',
  },
]

const FeaturesSection = () => {
  return (
    <section className='px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto w-full max-w-7xl'>
        <p className='text-sm font-semibold uppercase tracking-[0.16em] text-(--ms-primary)'>Features</p>
        <h2 className='mt-3 text-3xl font-semibold tracking-tight text-(--ms-ink) md:text-4xl'>
          Enterprise-grade security capabilities in one platform
        </h2>

        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature) => (
            <article
              key={feature.title}
              className='group rounded-3xl border border-(--ms-border) bg-white/75 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl'
            >
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 text-sm font-semibold text-white'>
                SG
              </div>
              <h3 className='mt-4 text-lg font-semibold text-(--ms-ink)'>{feature.title}</h3>
              <p className='mt-2 text-sm text-(--ms-muted) md:text-base'>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

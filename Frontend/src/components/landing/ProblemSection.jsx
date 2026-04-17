const risks = [
  'Weak authentication systems across healthcare software',
  'Doctor impersonation and forged digital identities',
  'No real-time prescription and access verification',
  'Poor encryption standards and incomplete audit trails',
]

const stats = [
  { value: '20%', label: 'Counterfeit medical products in circulation' },
  { value: '80%', label: 'Breaches involve data manipulation vectors' },
]

const ProblemSection = () => {
  return (
    <section className='px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto w-full max-w-7xl'>
        <p className='text-sm font-semibold uppercase tracking-[0.16em] text-rose-600'>Trust Crisis</p>
        <h2 className='mt-3 text-3xl font-semibold tracking-tight text-(--ms-ink) md:text-4xl'>
          Healthcare trust is breaking at the identity and data layer
        </h2>

        <div className='mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]'>
          <div className='rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-sm md:p-8'>
            <ul className='grid gap-3'>
              {risks.map((risk) => (
                <li key={risk} className='flex items-start gap-3 rounded-2xl bg-rose-50/70 p-4'>
                  <span className='mt-1 h-2.5 w-2.5 rounded-full bg-rose-500' />
                  <p className='text-sm font-medium text-slate-700 md:text-base'>{risk}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className='grid gap-4'>
            {stats.map((stat) => (
              <article
                key={stat.value}
                className='rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-6 shadow-sm'
              >
                <p className='text-4xl font-semibold tracking-tight text-(--ms-ink)'>{stat.value}</p>
                <p className='mt-2 text-sm text-(--ms-muted) md:text-base'>{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSection

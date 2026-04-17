const useCases = [
  {
    title: 'Hospitals',
    text: 'Secure clinician workflows, patient records, and prescription validation at scale.',
  },
  {
    title: 'Pharmacies',
    text: 'Verify prescription legitimacy in real time and reduce medicine fraud exposure.',
  },
  {
    title: 'Labs',
    text: 'Protect diagnostics data pipelines and ensure trusted report delivery end-to-end.',
  },
  {
    title: 'Government (ABDM)',
    text: 'Enable secure interoperability and policy-compliant data sharing for public platforms.',
  },
]

const UseCasesSection = () => {
  return (
    <section className='px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto w-full max-w-7xl'>
        <p className='text-sm font-semibold uppercase tracking-[0.16em] text-(--ms-primary)'>Use Cases</p>
        <h2 className='mt-3 text-3xl font-semibold tracking-tight text-(--ms-ink) md:text-4xl'>
          Designed for every critical healthcare stakeholder
        </h2>

        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {useCases.map((item) => (
            <article
              key={item.title}
              className='rounded-3xl border border-(--ms-border) bg-white/80 p-6 shadow-sm transition hover:border-sky-200 hover:shadow-lg'
            >
              <h3 className='text-xl font-semibold text-(--ms-ink)'>{item.title}</h3>
              <p className='mt-2 text-sm text-(--ms-muted)'>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UseCasesSection

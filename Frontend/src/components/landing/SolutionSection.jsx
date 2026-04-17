const solutions = [
  {
    title: 'Secure medical records',
    text: 'Clinical records are encrypted end-to-end with fine-grained role access and immutable history.',
  },
  {
    title: 'Verified doctor identity',
    text: 'Multi-factor practitioner verification with credential checks prevents impersonation attempts.',
  },
  {
    title: 'Tamper-proof prescriptions',
    text: 'Every prescription is cryptographically signed, timestamped, and traceable across stakeholders.',
  },
  {
    title: 'Real-time validation system',
    text: 'Instant verification APIs for hospitals and pharmacies reduce fraud at the point of care.',
  },
]

const SolutionSection = () => {
  return (
    <section className='px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto w-full max-w-7xl'>
        <p className='text-sm font-semibold uppercase tracking-[0.16em] text-sky-700'>Our Solution</p>
        <h2 className='mt-3 text-3xl font-semibold tracking-tight text-(--ms-ink) md:text-4xl'>
          A secure trust fabric for modern healthcare operations
        </h2>

        <div className='mt-8 grid gap-4 md:grid-cols-2'>
          {solutions.map((item) => (
            <article
              key={item.title}
              className='rounded-3xl border border-(--ms-border) bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
            >
              <h3 className='text-xl font-semibold tracking-tight text-(--ms-ink)'>{item.title}</h3>
              <p className='mt-2 text-sm text-(--ms-muted) md:text-base'>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SolutionSection

const capabilities = [
  'Real-time monitoring of AI agents and delegated tasks',
  'Policy-based actuation control with OPA/Rego guardrails',
  'Prevention of unauthorized and out-of-scope actions',
  'Tamper-evident action logs with forensic traceability',
  'Human + AI co-signature approvals for critical decisions',
  'Rollback unsafe actions with policy-aware recovery paths',
]

const AgentGuardSection = () => {
  return (
    <section className='px-5 py-16 md:px-8 md:py-24'>
      <div className='mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-8 text-white shadow-2xl shadow-cyan-950/25 md:p-12'>
        <div className='grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center'>
          <div>
            <p className='inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200'>
              AgentGuard
            </p>
            <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
              Runtime Sandbox &amp; Actuation Ledger
            </h2>
            <p className='mt-4 text-sm text-slate-200 md:text-base'>
              AgentGuard protects autonomous workflows in healthcare with runtime governance,
              tamper-evident accountability, and high-confidence human oversight.
            </p>
          </div>

          <ul className='grid gap-3'>
            {capabilities.map((item) => (
              <li
                key={item}
                className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cyan-50 backdrop-blur'
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default AgentGuardSection

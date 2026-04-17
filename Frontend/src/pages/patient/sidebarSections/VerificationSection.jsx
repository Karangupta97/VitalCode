const VerificationSection = ({ prescriptions }) => {
  return (
    <section className='pt-layout single-page'>
      <div className='pt-col-left'>
        <article className='pt-card'>
          <div className='pt-card-head'>
            <h3>Verification Registry</h3>
            <span className='pt-card-tag'>QR and Signature Chain</span>
          </div>
          <ul className='pt-notification-list'>
            {prescriptions.map((prescription) => (
              <li key={`${prescription.id}-verify`}>
                <div>
                  <p>{prescription.id}</p>
                  <small>Doctor: {prescription.doctor}</small>
                  <small>Signature: {prescription.signatureHash}</small>
                </div>
                <span>{prescription.qrRef}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default VerificationSection

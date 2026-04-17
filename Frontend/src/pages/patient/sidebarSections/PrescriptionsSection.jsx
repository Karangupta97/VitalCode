const PrescriptionsSection = ({
  prescriptions,
  getPrescriptionStatus,
  getRemainingTime,
  onUpdatePharmacyStatus,
}) => {
  return (
    <section className='pt-layout single-page'>
      <div className='pt-col-left'>
        <article className='pt-card'>
          <div className='pt-card-head'>
            <h3>Digital Prescription Center</h3>
            <span className='pt-card-tag'>QR + signature secured</span>
          </div>

          <div className='pt-prescription-list'>
            {prescriptions.map((prescription) => {
              const status = getPrescriptionStatus(prescription)
              const remainingTime = getRemainingTime(prescription.validityDeadline)
              const isLocked = status === 'Expired' || status === 'Issued'

              return (
                <article key={prescription.id} className='pt-prescription-card'>
                  <div className='pt-prescription-head'>
                    <div>
                      <h4>{prescription.id}</h4>
                      <p>Issued by {prescription.doctor} on {prescription.issuedDate}</p>
                    </div>
                    <span className={`pt-status-pill pt-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {status}
                    </span>
                  </div>

                  <ul className='pt-medicine-list'>
                    {prescription.medicines.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <div className='pt-verify-grid'>
                    <div className='pt-qr-box' aria-label='Prescription QR preview'>
                      <div className='pt-qr-grid' />
                      <span>{prescription.qrRef}</span>
                    </div>
                    <div className='pt-signature-box'>
                      <p>Digital Signature Verified</p>
                      <strong>{prescription.signatureHash}</strong>
                      <small>Hash integrity timestamped and immutable</small>
                    </div>
                  </div>

                  <div className='pt-prescription-foot'>
                    <p>
                      Validity: <strong>{remainingTime}</strong>
                    </p>
                    <button
                      type='button'
                      className='pt-action-btn secondary'
                      onClick={() => onUpdatePharmacyStatus(prescription.id)}
                      disabled={isLocked}
                    >
                      {status === 'Pending' && 'Pharmacy Scanned + Partially Issued'}
                      {status === 'Partially Issued' && 'Mark Fully Issued'}
                      {status === 'Issued' && 'Fully Issued'}
                      {status === 'Expired' && 'Prescription Expired'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}

export default PrescriptionsSection

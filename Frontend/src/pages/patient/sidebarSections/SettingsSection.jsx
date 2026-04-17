const SettingsSection = ({ patientProfile, onOpenProfileEditor }) => {
  return (
    <section className='pt-layout single-page'>
      <div className='pt-col-left'>
        <article className='pt-card'>
          <div className='pt-card-head'>
            <h3>Profile Settings</h3>
            <span className='pt-card-tag'>Editable Patient Identity</span>
          </div>
          <div className='pt-profile-grid'>
            <label>
              Full Name
              <input type='text' value={patientProfile.name} readOnly />
            </label>
            <label>
              Email
              <input type='text' value={patientProfile.email} readOnly />
            </label>
            <label>
              Phone
              <input type='text' value={patientProfile.phone} readOnly />
            </label>
            <label>
              Aadhaar ID
              <input type='text' value={patientProfile.aadhaarId} readOnly />
            </label>
            <label>
              Blood Group
              <input type='text' value={patientProfile.bloodGroup} readOnly />
            </label>
          </div>
          <div className='pt-profile-actions'>
            <button type='button' className='pt-action-btn' onClick={onOpenProfileEditor}>
              Edit Profile
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}

export default SettingsSection

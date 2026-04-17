import PrescriptionsSection from './PrescriptionsSection'
import ReportsSection from './ReportsSection'

const OverviewSection = ({
  overviewSection,
  onOpenReportVault,
  onOpenPrescriptions,
  onOpenPharmacy,
  reports,
  activePrescriptions,
  timeline,
  reportViewMode,
  onSetReportViewMode,
  onReportUpload,
  isUploading,
  uploadProgress,
  savedReportIds,
  onViewReport,
  onAnalyzeReport,
  onToggleSaveReport,
  onDeleteReport,
  aiInsight,
  onCloseAiInsight,
  prescriptions,
  getPrescriptionStatus,
  getRemainingTime,
  onUpdatePharmacyStatus,
}) => {
  const reviewedReportsCount = reports.filter((item) => item.status === 'Reviewed').length

  return (
    <>
      <section className='pt-stats'>
        <button
          type='button'
          className={`pt-stat-card pt-stat-card-button ${overviewSection === 'reports' ? 'is-active' : ''}`}
          onClick={onOpenReportVault}
          aria-pressed={overviewSection === 'reports'}
        >
          <p>Reports in Vault</p>
          <strong>{reports.length}</strong>
          <span>{reviewedReportsCount} reviewed by doctors</span>
        </button>
        <button
          type='button'
          className={`pt-stat-card pt-stat-card-button ${overviewSection === 'prescriptions' ? 'is-active' : ''}`}
          onClick={onOpenPrescriptions}
          aria-pressed={overviewSection === 'prescriptions'}
        >
          <p>Active Prescriptions</p>
          <strong>{activePrescriptions}</strong>
          <span>Includes pending and partially issued</span>
        </button>
        <button
          type='button'
          className={`pt-stat-card pt-stat-card-button ${overviewSection === 'pharmacy' ? 'is-active' : ''}`}
          onClick={onOpenPharmacy}
          aria-pressed={overviewSection === 'pharmacy'}
        >
          <p>Pharmacy Updates</p>
          <strong>{timeline.length}</strong>
          <span>Audit events visible in real time</span>
        </button>
      </section>

      {overviewSection === 'reports' && (
        <ReportsSection
          reportViewMode={reportViewMode}
          onSetReportViewMode={onSetReportViewMode}
          onReportUpload={onReportUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          reports={reports}
          savedReportIds={savedReportIds}
          onViewReport={onViewReport}
          onAnalyzeReport={onAnalyzeReport}
          onToggleSaveReport={onToggleSaveReport}
          onDeleteReport={onDeleteReport}
          aiInsight={aiInsight}
          onCloseAiInsight={onCloseAiInsight}
        />
      )}

      {overviewSection === 'prescriptions' && (
        <PrescriptionsSection
          prescriptions={prescriptions}
          getPrescriptionStatus={getPrescriptionStatus}
          getRemainingTime={getRemainingTime}
          onUpdatePharmacyStatus={onUpdatePharmacyStatus}
        />
      )}

      {overviewSection === 'pharmacy' && (
        <section className='pt-layout single-page'>
          <div className='pt-col-left'>{timelineCard}</div>
        </section>
      )}
    </>
  )
}

export default OverviewSection

import { LuLayoutGrid, LuList } from 'react-icons/lu'

const ReportsSection = ({
  reportViewMode,
  onSetReportViewMode,
  onReportUpload,
  isUploading,
  uploadProgress,
  reports,
  savedReportIds,
  onViewReport,
  onAnalyzeReport,
  onToggleSaveReport,
  onDeleteReport,
  aiInsight,
  onCloseAiInsight,
}) => {
  const renderReportActions = (report) => {
    const isSaved = savedReportIds.includes(report.id)

    return (
      <>
        <div className='pt-report-actions'>
          <button type='button' className='pt-table-action-btn view' onClick={() => onViewReport(report)}>
            View
          </button>
          <button type='button' className='pt-table-action-btn ai' onClick={() => onAnalyzeReport(report.id)}>
            AI Analyser
          </button>
          <button
            type='button'
            className='pt-table-action-btn save'
            onClick={() => onToggleSaveReport(report.id, report.name)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button type='button' className='pt-table-action-btn delete' onClick={() => onDeleteReport(report.id)}>
            Delete
          </button>
        </div>

        {aiInsight?.reportId === report.id && (
          <div className='pt-ai-inline-summary' role='status' aria-live='polite'>
            <div className='pt-ai-inline-head'>
              <p className='pt-ai-inline-title'>AI Summary</p>
              <button
                type='button'
                className='pt-ai-inline-close'
                aria-label='Close AI summary'
                onClick={onCloseAiInsight}
              >
                X
              </button>
            </div>
            <p>{aiInsight.summary}</p>
          </div>
        )}
      </>
    )
  }

  return (
    <section className='pt-layout single-page'>
      <div className='pt-col-left'>
        <article className='pt-card'>
          <div className='pt-card-head'>
            <h3>Report Vault Upload</h3>
            <div className='pt-report-head-actions'>
              <span className='pt-card-tag'>Zero-trust scan on upload</span>
              <label className='pt-upload-btn' htmlFor='pt-report-upload'>
                Upload
              </label>

              <div className='pt-report-view-toggle' role='group' aria-label='Report view mode'>
                <button
                  type='button'
                  className={`pt-report-view-btn ${reportViewMode === 'grid' ? 'is-active' : ''}`}
                  onClick={() => onSetReportViewMode('grid')}
                >
                  <LuLayoutGrid aria-hidden='true' />
                  <span>Grid</span>
                </button>

                <button
                  type='button'
                  className={`pt-report-view-btn ${reportViewMode === 'list' ? 'is-active' : ''}`}
                  onClick={() => onSetReportViewMode('list')}
                >
                  <LuList aria-hidden='true' />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          <input
            id='pt-report-upload'
            className='pt-upload-input'
            type='file'
            accept='.pdf,.jpg,.jpeg,.png'
            onChange={onReportUpload}
          />

          <p className='pt-upload-hint'>Supported: PDF, JPG, PNG | Max 10 MB</p>

          {isUploading && (
            <div className='pt-upload-progress' role='status' aria-live='polite'>
              <div className='pt-upload-progress-fill' style={{ width: `${uploadProgress}%` }} />
              <span>Encrypting and scanning... {uploadProgress}%</span>
            </div>
          )}

          {reportViewMode === 'list' ? (
            <div className='pt-report-table-wrap'>
              <table className='pt-report-table'>
                <thead>
                  <tr>
                    <th>Report</th>
                    <th>Uploaded On</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Scan</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <p>{report.name}</p>
                        <small>{report.id}</small>
                      </td>
                      <td>{report.uploadedOn}</td>
                      <td>{report.size}</td>
                      <td>
                        <span className={`pt-status-pill pt-status-${report.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <span className='pt-safe-pill'>{report.scanStatus}</span>
                      </td>
                      <td>{renderReportActions(report)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='pt-report-grid'>
              {reports.map((report) => (
                <article key={report.id} className='pt-report-grid-card'>
                  <div className='pt-report-grid-head'>
                    <div>
                      <p>{report.name}</p>
                      <small>{report.id}</small>
                    </div>
                    <span className={`pt-status-pill pt-status-${report.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {report.status}
                    </span>
                  </div>

                  <ul className='pt-report-grid-meta'>
                    <li>
                      <span>Uploaded</span>
                      <strong>{report.uploadedOn}</strong>
                    </li>
                    <li>
                      <span>Size</span>
                      <strong>{report.size}</strong>
                    </li>
                    <li>
                      <span>Scan</span>
                      <span className='pt-safe-pill'>{report.scanStatus}</span>
                    </li>
                  </ul>

                  {renderReportActions(report)}
                </article>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

export default ReportsSection

const AlertsSection = ({
  notifications,
  focused = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismissNotification,
}) => {
  const unreadCount = notifications.filter((item) => item.unread).length

  return (
    <section className='pt-layout single-page'>
      <div className='pt-col-left'>
        <article className={`pt-card ${focused ? 'pt-card-focus' : ''}`}>
          <div className='pt-card-head'>
            <h3>Notifications</h3>
            <span className='pt-card-tag'>{unreadCount} unread</span>
          </div>

          <div className='pt-profile-actions' style={{ marginTop: 0, marginBottom: '0.7rem' }}>
            <button
              type='button'
              className='pt-action-btn secondary'
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </button>
          </div>

          <ul className='pt-notification-list'>
            {notifications.length === 0 && (
              <li>
                <div>
                  <p>All Clear</p>
                  <small>No active alerts right now. You are fully caught up.</small>
                </div>
                <span>Now</span>
              </li>
            )}

            {notifications.map((notification) => (
              <li
                key={notification.id}
                style={notification.unread ? { borderColor: 'rgba(14, 116, 110, 0.45)' } : undefined}
              >
                <div>
                  <p>
                    {notification.type}
                    {notification.unread ? ' • New' : ''}
                  </p>
                  <small>{notification.text}</small>
                </div>

                <div style={{ display: 'grid', gap: '0.35rem', justifyItems: 'end' }}>
                  <span>{notification.time}</span>

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      type='button'
                      className='pt-table-action-btn view'
                      disabled={!notification.unread}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      Read
                    </button>
                    <button
                      type='button'
                      className='pt-table-action-btn delete'
                      onClick={() => onDismissNotification(notification.id)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default AlertsSection

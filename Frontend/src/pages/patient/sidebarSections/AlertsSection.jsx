const AlertsSection = ({ notifications, focused = false }) => {
  return (
    <section className='pt-layout single-page'>
      <div className='pt-col-left'>
        <article className={`pt-card ${focused ? 'pt-card-focus' : ''}`}>
          <div className='pt-card-head'>
            <h3>Notifications</h3>
            <span className='pt-card-tag'>Live trust signals</span>
          </div>

          <ul className='pt-notification-list'>
            {notifications.map((notification) => (
              <li key={notification.id}>
                <div>
                  <p>{notification.type}</p>
                  <small>{notification.text}</small>
                </div>
                <span>{notification.time}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default AlertsSection

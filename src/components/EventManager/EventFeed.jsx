import EventItem from './EventItem'

export default function EventFeed({ events, players, onClear, limit, compact }) {
  const sorted = [...events].sort((a, b) => b.timestamp - a.timestamp)
  const displayed = limit ? sorted.slice(0, limit) : sorted

  return (
    <div className={`event-feed${compact ? ' event-feed--compact' : ''}`}>
      {onClear && events.length > 0 && (
        <div className="event-feed-header">
          <span className="event-feed-count">{events.length} event{events.length !== 1 ? 's' : ''}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClear}>Clear All</button>
        </div>
      )}

      {displayed.length === 0 ? (
        <p className="event-feed-empty">No events recorded yet</p>
      ) : (
        <div className="event-feed-list">
          {displayed.map(event => (
            <EventItem key={event.id} event={event} players={players} compact={compact} />
          ))}
        </div>
      )}
    </div>
  )
}

export const EVENT_TYPES = [
  { value: 'goal',         label: 'Goal',         icon: '⚽' },
  { value: 'assist',       label: 'Assist',       icon: '🅰️' },
  { value: 'yellowCard',   label: 'Yellow Card',  icon: '🟨' },
  { value: 'redCard',      label: 'Red Card',     icon: '🟥' },
  { value: 'substitution', label: 'Substitution', icon: '🔁' },
  { value: 'penalty',      label: 'Penalty',      icon: '🎯' },
  { value: 'timeout',      label: 'Timeout',      icon: '⏱' },
  { value: 'injury',       label: 'Injury',       icon: '🚑' },
]

export const EVENT_ICON = Object.fromEntries(EVENT_TYPES.map(e => [e.value, e.icon]))
export const EVENT_LABEL = Object.fromEntries(EVENT_TYPES.map(e => [e.value, e.label]))

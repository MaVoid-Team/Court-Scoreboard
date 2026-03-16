import { useState } from 'react'

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Other']

export default function PlayerForm({ initial, teamA, teamB, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    number: '',
    position: 'Forward',
    team: null,
    photo: '',
    stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    ...initial,
  })

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('photo', reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!form.name.trim() || form.number === '' || form.number === null) return
    onSave({ ...form, number: parseInt(form.number, 10) })
  }

  const isEditing = Boolean(initial?.id)

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? 'Edit Player' : 'Add Player'}</h3>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-body">
          <div className="player-form-grid">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                className="form-input"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Player name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jersey Number *</label>
              <input
                type="number"
                className="form-input"
                value={form.number}
                onChange={e => set('number', e.target.value)}
                placeholder="7"
                min="1"
                max="99"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Position</label>
              <select className="form-input" value={form.position} onChange={e => set('position', e.target.value)}>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Team</label>
              <select className="form-input" value={form.team ?? ''} onChange={e => set('team', e.target.value || null)}>
                <option value="">Unassigned</option>
                <option value="A">{teamA} (Team A)</option>
                <option value="B">{teamB} (Team B)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">Photo</label>
            <input type="file" accept="image/*" onChange={handlePhoto} className="form-input" />
            {form.photo && <img src={form.photo} alt="Preview" className="form-photo-preview" />}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!form.name.trim() || form.number === '' || form.number === null}
          >
            {isEditing ? 'Save Changes' : 'Add Player'}
          </button>
        </div>
      </div>
    </div>
  )
}

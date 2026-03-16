import { useRef } from 'react'
import { useScoreboard } from '../../context/ScoreboardContext'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function UploadControls() {
  const { state, updateState } = useScoreboard()
  const carouselInputRef = useRef(null)

  const handleLogoUpload = async (team, file) => {
    if (!file) return
    const base64 = await fileToBase64(file)
    updateState(prev => ({
      ...prev,
      [team]: { ...prev[team], logo: base64 },
    }))
  }

  const handleCarouselUpload = async (files) => {
    if (!files || files.length === 0) return
    const newImages = await Promise.all(Array.from(files).map(fileToBase64))
    updateState(prev => ({
      ...prev,
      carouselImages: [...prev.carouselImages, ...newImages],
    }))
    // Reset file input
    if (carouselInputRef.current) carouselInputRef.current.value = ''
  }

  const removeCarouselImage = (index) => {
    updateState(prev => ({
      ...prev,
      carouselImages: prev.carouselImages.filter((_, i) => i !== index),
    }))
  }

  const clearLogo = (team) => {
    updateState(prev => ({
      ...prev,
      [team]: { ...prev[team], logo: '' },
    }))
  }

  return (
    <>
      {/* Logo Upload */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-icon blue">🖼</div>
          <span className="admin-card-title">Team Logos</span>
        </div>
        <div className="admin-card-body">
          <div className="team-cols">
            {/* Team A Logo */}
            <div>
              <p className="team-col-label team-a">{state.teamA.name} Logo</p>
              <div className="upload-area">
                <label className="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleLogoUpload('teamA', e.target.files[0])}
                  />
                  <span className="upload-icon">📁</span>
                  <span className="upload-text">Click to upload</span>
                  <span className="upload-subtext">PNG, JPG, SVG</span>
                </label>
              </div>
              {state.teamA.logo && (
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <img src={state.teamA.logo} alt="Team A logo" className="logo-preview" />
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: '6px', fontSize: '0.7rem' }}
                    onClick={() => clearLogo('teamA')}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Team B Logo */}
            <div>
              <p className="team-col-label team-b">{state.teamB.name} Logo</p>
              <div className="upload-area">
                <label className="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleLogoUpload('teamB', e.target.files[0])}
                  />
                  <span className="upload-icon">📁</span>
                  <span className="upload-text">Click to upload</span>
                  <span className="upload-subtext">PNG, JPG, SVG</span>
                </label>
              </div>
              {state.teamB.logo && (
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <img src={state.teamB.logo} alt="Team B logo" className="logo-preview" />
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: '6px', fontSize: '0.7rem' }}
                    onClick={() => clearLogo('teamB')}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Upload */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-icon purple">🎠</div>
          <span className="admin-card-title">Sponsor Carousel</span>
        </div>
        <div className="admin-card-body">
          <div className="upload-area">
            <label className="upload-label">
              <input
                ref={carouselInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={e => handleCarouselUpload(e.target.files)}
              />
              <span className="upload-icon">🖼</span>
              <span className="upload-text">Upload sponsor images</span>
              <span className="upload-subtext">Multiple files supported · PNG, JPG, SVG</span>
            </label>
          </div>

          {state.carouselImages.length > 0 && (
            <>
              <div className="divider" />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
                  {state.carouselImages.length} image{state.carouselImages.length !== 1 ? 's' : ''} loaded
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.72rem', color: 'var(--admin-danger)' }}
                  onClick={() => updateState(prev => ({ ...prev, carouselImages: [] }))}
                >
                  Clear All
                </button>
              </div>
              <div className="carousel-thumbnails">
                {state.carouselImages.map((src, i) => (
                  <div key={i} className="carousel-thumb-wrap">
                    <img src={src} alt={`Sponsor ${i + 1}`} className="carousel-thumb" />
                    <button
                      className="carousel-thumb-remove"
                      onClick={() => removeCarouselImage(i)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

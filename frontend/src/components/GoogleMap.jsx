import React from 'react'

function GoogleMap({ setShowMap, venue }) {
  return (
    <div>
      <div className="mapouter">
        <div className="gmap_canvas">
          <iframe title="map" id="gmap_canvas" src={`https://maps.google.com/maps?q=${venue}&t=&z=14&ie=UTF8&iwloc=&output=embed`} frameBorder="20px" scrolling="yes" marginHeight="0" marginWidth="0">
          </iframe>
        </div>
      </div>

      <button onClick={() => setShowMap(false)}>Bezár</button>
    </div>
  )
}

export default GoogleMap

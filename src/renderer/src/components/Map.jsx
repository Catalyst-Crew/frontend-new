import { useState } from 'react'
import PropTypes from 'prop-types'

import { Draggable, GeoJson, Map, Marker } from 'pigeon-maps'

import CopyText from './CopyText'

const accessPoints = [
  { lat: -26.260693, lng: 29.121075, id: 1, nodes: 5 },
  { lat: -26.261693, lng: 29.120075, id: 2, nodes: 3 },
  { lat: -26.262693, lng: 29.121075, id: 3, nodes: 8 }
]

export function MyMap({ defaultZoom, setZoom, defaultCenter, setCenter }) {
  const [overlayData, setOverlayData] = useState(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [anchor, setAnchor] = useState([-26.260693, 29.121075])

  const CustomIcon = ({ count }) => {
    const SIZE = '25'
    return (
      <svg
        width={SIZE}
        height={SIZE}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate(-${count.toString().length * 2}px, -${
            count.toString().length * 2
          }px)`,
          cursor: 'pointer',
          pointerEvents: 'all'
        }}
      >
        <circle cx="25" cy="25" r="25" fill="#FFC107" />
        <text x="50%" y="50%" textAnchor="middle" fill="black" fontSize="20px" dy=".3em">
          {count}
        </text>
      </svg>
    )
  }

  CustomIcon.propTypes = {
    count: PropTypes.number
  }
  return (
    <Map
      minZoom={5}
      maxZoom={18}
      animate={true}
      zoom={defaultZoom}
      center={defaultCenter}
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      onBoundsChanged={({ center, zoom }) => {
        setCenter(center)
        setZoom(zoom)
      }}
    >
      {accessPoints.map((point) => (
        <Marker
          key={point.id}
          width={50}
          anchor={[point.lat, point.lng]}
          onClick={() => setZoom(16.2)}
          onMouseOver={({ anchor }) => {
            setShowOverlay(true)
            setAnchor(anchor)
            setOverlayData(point)
          }}
          onMouseOut={() => {
            setOverlayData(null)
            setShowOverlay(false)
          }}
          className="pointer-events-auto"
        >
          <CustomIcon count={point.nodes} />
        </Marker>
      ))}

      {showOverlay ? (
        <Draggable
          anchor={anchor}
          onDragEnd={setAnchor}
          offset={[120, anchor[1] + 150]}
          style={{
            padding: '10px',
            borderRadius: '5%',
            alignItems: 'center',
            backgroundColor: 'white',
            boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'all'
          }}
        >
          <div className="flex justify-content-end">
            <span
              icon="pi pi-times"
              className="cursor-pointer pi pi-times"
              onClick={() => setShowOverlay(false)}
            />
          </div>
          <table>
            <tbody>
              <tr>
                <td>AP ID:</td>
                <td>{overlayData.id}</td>
              </tr>
              <tr>
                <td>Nodes:</td>
                <td>{overlayData.nodes}</td>
              </tr>
              <tr>
                <td>Lat/Log:</td>
                <td>
                  <CopyText text={`${overlayData.lat}, ${overlayData.lng}`} />
                </td>
              </tr>
            </tbody>
          </table>
          <p
            className="text-center pointer-events-auto cursor-pointer"
            onClick={() => {
              setZoom(16.2)
              setCenter([overlayData.lat, overlayData.lng])
            }}
          >
            Click to zoom
          </p>
        </Draggable>
      ) : null}
      <GeoJson
        data={{
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [29.121075, -26.260693],
                    [29.120075, -26.261693],
                    [29.121075, -26.262693],
                    [29.122075, -26.261693],
                    [29.121075, -26.260693]
                  ]
                ]
              },
              properties: {
                prop0: 'value0',
                prop1: 0.0,
                fill: 'lightcoral',
                stroke: 'red',
                'stroke-width': 2,
                text: 'Block A',
                'text-anchor': 'middle',
                'text-offset': [0, 0]
              }
            }
          ]
        }}
        styleCallback={(feature) => {
          if (feature.geometry.type === 'LineString') {
            return { strokeWidth: '1', stroke: 'black' }
          }
          return {
            fill: '#d4e6ec99',
            strokeWidth: '1',
            stroke: 'white',
            r: '20'
          }
        }}
      />
    </Map>
  )
}

MyMap.propTypes = {
  defaultZoom: PropTypes.number,
  setZoom: PropTypes.func,
  defaultCenter: PropTypes.array,
  setCenter: PropTypes.func
}

export default MyMap

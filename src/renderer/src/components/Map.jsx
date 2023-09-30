import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Draggable, GeoJson, Map, Marker } from 'pigeon-maps'

import { Button } from 'primereact/button'

import CopyText from './CopyText'
import { API_URL } from '../utils/exports'
import { catchHandler } from '../utils/functions'
import { selectAccessPoints, selectFocusedAccessPoint, selectUserToken } from '../store/store'
import { setFocusedAccesspoint } from '../store/features/dashboadSlice'

const colors = ['blue', 'red', 'green', 'black', 'yellow', 'orange', 'purple']

export function MyMap({ defaultZoom, setZoom, defaultCenter, setCenter, toastRef }) {
const dispatch = useDispatch()

  const [areas, setAreas] = useState([])
  const [overlayData, setOverlayData] = useState(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [anchor, setAnchor] = useState([-26.260693, 29.121075])

  const token = useSelector(selectUserToken)
  const accessPoints = useSelector(selectAccessPoints)
  const focusedAccessPoint = useSelector(selectFocusedAccessPoint)

  const CustomIcon = ({ count = 0, status, selected, emergency }) => {
    const SIZE = 25
    return (
      <svg
        width={selected ? SIZE + 5 : SIZE}
        height={selected ? SIZE + 5 : SIZE}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate(-${count.toString().length * 2}px, -${
            count.toString().length * 2
          }px)`,
          cursor: 'pointer',
          pointerEvents: 'all',
          transition: 'ease-in-out',
          transitionDuration: '5s',
          transitionProperty: 'revert'
        }}
      >
        <circle cx="25" cy="25" r="25" fill={emergency ? 'red' : status ? '#FFC107' : 'grey'} />
        <text x="50%" y="50%" textAnchor="middle" fill="black" fontSize="22px" dy=".3em">
          {count}
        </text>
      </svg>
    )
  }

  CustomIcon.propTypes = {
    count: PropTypes.number,
    status: PropTypes.number,
    emergency: PropTypes.bool
  }

  useEffect(() => {
    setAreas(JSON.parse(localStorage.getItem('areas')))
    return getAreas()
  }, [])

  const getAreas = () => {
    axios
      .get(`${API_URL}/areas`, {
        headers: { 'x-access-token': token }
      })
      .then((response) => {
        localStorage.setItem('areas', JSON.stringify(response.data))
        setAreas(response.data)
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
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
      {areas ? (
        <GeoJson
          data={{
            type: 'FeatureCollection',
            features: areas.map((area, i) => ({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [area.draw_coords],
                fill: '#d4e6ec99'
              },
              properties: {
                stroke: colors[i],
                name: area.name || 'Area',
                lat: area.lat,
                lng: area.longitude
              }
            }))
          }}
          styleCallback={(feature) => {
            if (feature.geometry.type === 'LineString') {
              return { strokeWidth: '1', stroke: 'black' }
            }
            return {
              fill: '#d4e6ec99',
              strokeWidth: '1',
              stroke: feature.properties.stroke || 'white',
              r: '20',
              label: {
                text: feature.properties.name,
                x: feature.properties.lng,
                y: feature.properties.lat,
                dy: '0.35em',
                fontSize: '50px',
                textAnchor: 'middle'
              }
            }
          }}
        />
      ) : null}

      {accessPoints?.map((point, i) => (
        <Marker
          key={point?.access_point_id + i}
          width={50}
          anchor={[point?.access_point_latitude, point?.access_point_longitude]}
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
          <CustomIcon
            key={point?.access_point_id + i * 2}
            status={point?.access_point_status}
            count={point?.measurements?.length}
            selected={focusedAccessPoint === point?.access_point_id}
            emergency={point?.emergency}
          />
        </Marker>
      ))}

      {showOverlay ? (
        <Draggable
          anchor={anchor}
          onDragEnd={setAnchor}
          offset={[120, anchor[1] + 200]}
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
              className="cursor-pointer pi pi-times text-0"
              onClick={() => setShowOverlay(false)}
            />
          </div>
          <table className="text-0">
            <tbody>
              <tr>
                <td>AP ID:</td>
                <td>{overlayData?.access_point_id}</td>
              </tr>
              <tr>
                <td>AP Name:</td>
                <td>{overlayData?.access_point_name}</td>
              </tr>
              <tr>
                <td>Nodes:</td>
                <td>{overlayData?.measurements?.length || 0}</td>
              </tr>
              <tr>
                <td>Area ID:</td>
                <td>{overlayData?.area_id}</td>
              </tr>
              <tr>
                <td>Lat/Long:</td>
                <td>
                  <CopyText
                    text={`${overlayData?.id_prefix_access_point}${overlayData?.access_point_latitude}, ${overlayData?.access_point_longitude}`}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-content-center">
            <Button
              label="Click to zoom"
              className=" m-2"
              text
              size="small"
              onClick={() => {
                setZoom(16.2)
                setCenter([overlayData?.access_point_latitude, overlayData?.access_point_longitude])
              }}
            />
            <Button label="View" className="mt" size="small" text onClick={()=>{dispatch(setFocusedAccesspoint(overlayData?.access_point_id))}}/>
          </div>
        </Draggable>
      ) : null}
    </Map>
  )
}

MyMap.propTypes = {
  defaultZoom: PropTypes.number,
  setZoom: PropTypes.func,
  defaultCenter: PropTypes.array,
  setCenter: PropTypes.func,
  toastRef: PropTypes.object
}

export default MyMap

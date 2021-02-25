import { useState, useEffect } from 'react'
import { feature } from 'topojson-client'
import { geoEqualEarth, geoPath } from 'd3-geo'
import ReactTooltip from 'react-tooltip'

import useHasMounted from '../hooks/useHasMounted'
import styles from '../styles/MapPeru.module.css'
import peruMapa from '../public/maps/peru.json'
import normalizeText from './TextFormat'
import FormatNumber from './FormatNumber'
import FormatPercentage from './FormatPercentage'

const projection = geoEqualEarth().rotate([78, 7, 0]).scale(1700)

const MapPeru = ({data}) => {
    const [geoFile, setGeoFile] = useState([])
    const hasMounted = useHasMounted()
    const [content, setContent] = useState([])

    useEffect(()=>{
        const objMapa = feature(peruMapa, peruMapa.objects["peru"]).features
        objMapa.forEach((element) => {
            let departamento = normalizeText(element.properties["woe-name"])
            data.map((el) => {
                if (el.departamento === departamento) {
                    Object.assign(element.properties, el)
                }
                return true
            })
        })
        setGeoFile(objMapa)
    }, [data])

    const coloringMap = (porcentaje) => {
        if (porcentaje) {
          const resultado =
            porcentaje >= 0.9
              ? '#00414D'
              : porcentaje >= 0.8
                ? '#00778C'
                : porcentaje >= 0.7
                  ? '#0097B3'
                  : porcentaje >= 0.6
                    ? '#00ADCC'
                    : '#00B8D9'
          return resultado
        }
      }
    
      const tooltipText = ({
        departamento,
        primeraDosis,
        segundaDosis,
        porcentajePrimeraDosis,
        porcentajeSegundaDosis
      }) => {
        return (
          <div className={styles.tooltip}>
            <p className={styles.tooltipSubText}>
              {departamento} 
            </p>
            <p className={styles.tooltipSubText}>
              <FormatNumber>{primeraDosis}</FormatNumber> Primeras Dosis administradas
            </p>
            <p className={styles.tooltipSubText}>
              <FormatNumber>{segundaDosis}</FormatNumber> Segundas Dosis administradas
            </p>
            <p className={styles.tooltipSubText}>
              <FormatPercentage>{porcentajePrimeraDosis}</FormatPercentage> de Primera Dosis
            </p>
            <p className={styles.tooltipSubText}>
              <FormatPercentage>{porcentajeSegundaDosis}</FormatPercentage> de Segunda Dosis
            </p>
          </div>
        )
      }

    return <>
        <div className={styles.container} data-tip=''>
            <svg viewBox="0 0 1000 646">
                <g className='peru'>
                    {
                        geoFile.map((d, i)=>{
                           return <path 
                                d={geoPath().projection(projection)(d)}
                                key={`geoPath-${i}`}
                                fill={coloringMap(d.properties.primeraDosis)}
                                onMouseEnter={() => setContent(tooltipText(d.properties))}
                                onMouseLeave={() => setContent('')}
                                stroke='#FFFFFF'
                                strokeWidth={0.5}
                            />
                        })
                    }
                </g>
            </svg>
            {hasMounted && <ReactTooltip>{content}</ReactTooltip>}
        </div>
    </>
}

export default MapPeru
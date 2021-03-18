import { DatasetJsonLd } from 'next-seo'
import styles from '../../../styles/ProgressChart.module.css'
 
function formatNumberToLocale (payload, locale) {
  if (!payload) return

  const value = payload[0].value
  const num = new Intl.NumberFormat(locale)
  return num.format(value)
}

function Bold ({ text }) {
  return <b style={{ color: 'var(--text-subtitle-color)' }}>{text}</b>
}

export function PrimeraDosisTooltip ({ active, payload, label, data }) {
  if (!active) return null
  const value = formatNumberToLocale(payload, 'es-ES')
  console.log(value)
  let indice = data.findIndex(d=>d.name===label)
  let nuevos = data[indice].value-data[indice-1].value
  console.log(value)
  let dataFilter = data.slice(indice-6, indice+1)
  console.log(dataFilter)
  let minimo = Math.min(...dataFilter.map(df=>df.value))
  console.log(value)
  dataFilter.forEach((df,i)=>{
    dataFilter[i].value-=minimo
  })
  let total = dataFilter.map(df=>df.value).reduce((acc, cur)=>acc+cur, 0)
  let promedio = total/dataFilter.length
  console.log(value)
  return (
    <div className={styles.chartTooltip}>
      <p>
        fecha: <Bold text={label} />
      </p>
      <p>
        primera dosis: <Bold text={value} /> 
      </p>
      <p>
        Nuevos: <Bold text={nuevos} /> 
      </p>
      <p>
        promedio 7 dias: <Bold text={promedio.toFixed(0)} /> 
      </p>
    </div>
  )
}

export function SegundaDosisTooltip ({ active, payload, label }) {
  if (!active) return null

  const value = formatNumberToLocale(payload, 'es-ES')

  return (
    <div className={styles.chartTooltip}>
      <p>
        <Bold text={label} />
      </p>
      <p>
        Segunda Dosis: <Bold text={value} />
      </p>
    </div>
  )
}

export function primeraDosisDepartamentoTooltip ({ active, payload, label }) {
  if (!active) return null

  const value = formatNumberToLocale(payload, 'es-ES')


  return (<>
      <div className={styles.chartTooltip}>
         <p>
              <Bold text={label} />
            </p>
      { 
        payload.map(element=>{
          return( 
            <p>
              {element.name}: <Bold text={element.value} />
            </p>
        
            )
        }) 
        
      }
    </div>
    </>
  )
}
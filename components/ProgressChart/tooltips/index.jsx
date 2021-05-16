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
  let indice = data.findIndex(d=>d.name===label)
  let nuevos = indice==0?data[indice].value : data[indice].value-data[indice-1].value
  //let dataFilter = data.slice(indice-6, indice+1)
  //let minimo = Math.min(...dataFilter.map(df=>df.value))
  //dataFilter.forEach((df,i)=>{
  //  dataFilter[i].value-=minimo
  //}) 
  //let total = dataFilter.map(df=>df.value).reduce((acc, cur)=>acc+cur, 0)
  //let promedio = total/dataFilter.length
  return (
    <div className={styles.chartTooltip}>
      <p>
        Fecha: <Bold text={label} />
      </p>
      <p>
        Primera Dosis: <Bold text={value} /> 
      </p>
      <p>
        Nuevos: <Bold text={nuevos} /> 
      </p>
    </div>
  )
}

export function SegundaDosisTooltip ({ active, payload, label, data }) {
  if (!active) return null

  const value = formatNumberToLocale(payload, 'es-ES')
  let indice = data.findIndex(d=>d.name===label)
  let nuevos = indice==0?data[indice].value : data[indice].value-data[indice-1].value

  return (
    <div className={styles.chartTooltip}>
      <p>
        <Bold text={label} />
      </p>
      <p>
        Segunda Dosis: <Bold text={value} />
      </p>
      <p>
        Nuevos: <Bold text={nuevos} /> 
      </p>
    </div>
  )
}

export function positivosCovidTooltip ({ active, payload, label, data }) {
  if (!active) return null

  const value = formatNumberToLocale(payload, 'es-ES')

  return (
    <div className={styles.chartTooltip}>
      <p>
        <Bold text={label} />
      </p>
      <p>
        Positivos Covid: <Bold text={value} />
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
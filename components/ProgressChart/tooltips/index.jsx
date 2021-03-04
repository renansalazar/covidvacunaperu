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

export function PrimeraDosisTooltip ({ active, payload, label }) {
  if (!active) return null
  const value = formatNumberToLocale(payload, 'es-ES')
  return (
    <div className={styles.chartTooltip}>
      <p>
        <Bold text={label} />
      </p>
      <p>
        Primera Dosis: <Bold text={value} />
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
import { useState } from 'react'
import styles from '../styles/Progress.module.css'

import { formatPercentage } from './FormatPercentage'
import { useLocale } from '../hooks/useLocale'

const FILTERS = {
    primeraDosis: 'porcentajePrimeraDosis',
    segundaDosis: 'porcentajeSegundaDosis'
}

const Progress = ({data}) => {
    const locale = useLocale()
    const [filter, setFilter] = useState(FILTERS.primeraDosis)
    const value = data[filter]
    return (
        <>
            <form className={styles.form}>
                <div className={styles.groupForm}>
                    <label>
                        <input 
                          type="radio" 
                          name="typeReport"
                          onChange={()=>setFilter(FILTERS.primeraDosis)}
                          checked={filter===FILTERS.primeraDosis}
                        />
                        Primera Dosis
                    </label>
                    <label>
                        <input 
                          type="radio" 
                          name="typeReport"
                          onChange={()=>setFilter(FILTERS.segundaDosis)} 
                          checked={filter===FILTERS.segundaDosis}
                        />
                        Segunda Dosis
                    </label>
                </div>
                <section data-value={formatPercentage({locale, value})}>
                    <progress value={value*100} max="100" />
                </section>
            </form>
        </>
    )
}

export default Progress
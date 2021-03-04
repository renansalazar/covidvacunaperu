import styles from '../styles/Progress.module.css'

import { formatPercentage } from './FormatPercentage'
import { useLocale } from '../hooks/useLocale'

const Progress = ({data}) => {
    const locale = useLocale()
    const value = data
    return (
        <>
            <div className={styles.containerProgress}>
                <section data-value={formatPercentage({locale, value})}>
                    <progress value={value*100} max="100" />
                </section>
            </div>
        </>
    )
}

export default Progress
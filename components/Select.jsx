import styles from '../styles/Select.module.css'

export default ({data, onChange})=>{
    let departamentos = data
    departamentos = departamentos.filter(d=>d!=='TOTAL').sort()
    
    return (<>
        <p className={styles.containerSelect}>Mostrar Reporte de
            <select 
                className={styles.select}
                onChange={(e) => onChange(e.target.value)}    
            >
                <option value='TOTAL'>Todo el Perú</option>
                {
                    departamentos.map(d=>{
                    return <option value={d}>{d.toLowerCase()}</option>
                    })
                }
            </select>
        </p>
    </>)
}
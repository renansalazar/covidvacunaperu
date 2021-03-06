import { useRef } from 'react'

import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'


import styles from '../../styles/ProgressChart.module.css'
import { CustomXTick, CustomYTick } from './ticks'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'

export function ProgressChart ({ dataset, tooltip: CustomTooltip }) {
  const elementRef = useRef(null)

  const [isVisible] = useIntersectionObserver({
    elementRef,
    freezeOnceVisible: true
  })
  
  if (!dataset) return null
  return (
    <div className={styles.chartContainer} ref={elementRef}>
      {isVisible && (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart
              data={dataset}
              margin={{
                top: 50,
                right: 0,
                left: 0,
                bottom: 50
              }}
            >
              <XAxis 
                dataKey='name' 
                tick={<CustomXTick />} 
              />
              <YAxis
                domain={[0, 'dataMax + 100']}
                interval='preserveStartEnd'
                width={100}
                scale='linear'
                tick={<CustomYTick />}
              />
              <Tooltip content={<CustomTooltip data={dataset}/>} />
              <Area
                type='monotone'
                dataKey='value'
                stroke='var(--main-text-color)'
                fill='#d2effd'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

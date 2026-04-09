import React from 'react'
import FuelSection from './components/FuelSection'
import GasolineSection from './components/GasolineSection'
import Comparison from './components/Comparison'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [lpgEntries, setLpgEntries] = useLocalStorage('lpg-entries', [])
  const [gasPrices, setGasPrices] = useLocalStorage('gas-prices', [])
  const [avgConsumption, setAvgConsumption] = useLocalStorage('avg-consumption', '')

  // Keep gasPrices array in sync with lpgEntries length
  const handleSetLpgEntries = (value) => {
    const next = typeof value === 'function' ? value(lpgEntries) : value
    setLpgEntries(next)
    if (next.length > gasPrices.length) {
      setGasPrices([
        ...gasPrices,
        ...Array(next.length - gasPrices.length).fill({ pricePerLiter: '' }),
      ])
    } else if (next.length < gasPrices.length) {
      setGasPrices(gasPrices.slice(0, next.length))
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>LPG Savings Calculator</h1>
        <p>Track and compare your fuel costs</p>
      </header>

      <main className="sections">
        <FuelSection
          title="LPG"
          colorClass="section-lpg"
          entries={lpgEntries}
          setEntries={handleSetLpgEntries}
        />
        <GasolineSection
          lpgEntries={lpgEntries}
          gasPrices={gasPrices}
          setGasPrices={setGasPrices}
          avgConsumption={avgConsumption}
          setAvgConsumption={setAvgConsumption}
        />
      </main>

      <Comparison
        lpgEntries={lpgEntries}
        gasPrices={gasPrices}
        avgConsumption={avgConsumption}
      />
    </div>
  )
}

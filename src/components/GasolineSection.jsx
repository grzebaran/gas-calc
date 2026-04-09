import React from 'react'
import { gasStats, fmt } from '../utils/calc'

export default function GasolineSection({
  lpgEntries,
  gasPrices,
  setGasPrices,
  avgConsumption,
  setAvgConsumption,
}) {
  const consumption = parseFloat(avgConsumption) || 0
  const stats = gasStats(lpgEntries, gasPrices, avgConsumption)

  const updatePrice = (i, val) =>
    setGasPrices(gasPrices.map((p, idx) => (idx === i ? { pricePerLiter: val } : p)))

  return (
    <section className="fuel-section section-gas">
      <h2>Gasoline</h2>

      <div className="avg-consumption-row">
        <label>
          <span>Avg consumption (L / 100km)</span>
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="0.0"
            value={avgConsumption}
            onChange={(e) => setAvgConsumption(e.target.value)}
          />
        </label>
      </div>

      <div className="entries">
        {lpgEntries.length === 0 && (
          <p className="empty-hint">Add LPG entries to see gasoline comparison.</p>
        )}
        {lpgEntries.map((lpgEntry, i) => {
          const km = parseFloat(lpgEntry.km) || 0
          const liters = (km / 100) * consumption
          return (
            <div key={i} className="entry-row gas-derived-row">
              <div className="readonly-field">
                <span>KM driven</span>
                <span className="readonly-value">{km || '—'}</span>
              </div>
              <div className="readonly-field">
                <span>Liters</span>
                <span className="readonly-value">
                  {consumption > 0 && km > 0 ? liters.toFixed(2) : '—'}
                </span>
              </div>
              <label>
                <span>Price / L</span>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  placeholder="0.000"
                  value={gasPrices[i]?.pricePerLiter || ''}
                  onChange={(e) => updatePrice(i, e.target.value)}
                />
              </label>
            </div>
          )
        })}
      </div>

      <div className="section-summary">
        <div className="stat">
          <span className="stat-label">Cost / 100 km</span>
          <span className="stat-value">{fmt(stats.costPer100km)} zł</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total spent</span>
          <span className="stat-value">{fmt(stats.totalCost)} zł</span>
        </div>
      </div>
    </section>
  )
}

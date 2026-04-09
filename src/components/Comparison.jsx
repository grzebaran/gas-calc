import React from 'react'
import { costPer100km, totalCost, gasStats, fmt } from '../utils/calc'

export default function Comparison({ lpgEntries, gasPrices, avgConsumption }) {
  const lpgC100 = costPer100km(lpgEntries)
  const lpgTotal = totalCost(lpgEntries)
  const { costPer100km: gasC100, totalCost: gasTotal } = gasStats(lpgEntries, gasPrices, avgConsumption)

  const cheaper100 =
    gasC100 !== null && lpgC100 !== null
      ? gasC100 < lpgC100
        ? 'Gasoline'
        : lpgC100 < gasC100
        ? 'LPG'
        : 'Equal'
      : null

  const cheaperTotal =
    gasTotal > 0 && lpgTotal > 0
      ? gasTotal < lpgTotal
        ? 'Gasoline'
        : lpgTotal < gasTotal
        ? 'LPG'
        : 'Equal'
      : null

  const saving100 =
    gasC100 !== null && lpgC100 !== null ? Math.abs(gasC100 - lpgC100) : null

  const totalSavings =
    gasTotal > 0 && lpgTotal > 0 ? Math.abs(gasTotal - lpgTotal) : null

  const hasSavings = saving100 !== null || totalSavings !== null

  return (
    <section className="comparison">
      <h2>Comparison</h2>
      <table className="compare-table">
        <thead>
          <tr>
            <th></th>
            <th>LPG</th>
            <th>Gasoline</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cost / 100 km</td>
            <td>{fmt(lpgC100)} zł</td>
            <td>{fmt(gasC100)} zł</td>
            <td className="winner">{cheaper100 ?? '—'}</td>
          </tr>
          <tr>
            <td>Total spent</td>
            <td>{fmt(lpgTotal)} zł</td>
            <td>{fmt(gasTotal)} zł</td>
            <td className="winner">{cheaperTotal ?? '—'}</td>
          </tr>
        </tbody>
      </table>

      {hasSavings && (
        <div className="savings-cards">
          {saving100 !== null && (
            <div className="savings-card">
              <span className="savings-label">Savings per 100 km</span>
              <span className="savings-amount">{fmt(saving100)} zł</span>
              <span className="savings-winner">{cheaper100} is cheaper</span>
            </div>
          )}
          {totalSavings !== null && (
            <div className="savings-card">
              <span className="savings-label">Total savings</span>
              <span className="savings-amount">{fmt(totalSavings)} zł</span>
              <span className="savings-winner">{cheaperTotal} is cheaper</span>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

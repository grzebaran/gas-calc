import React from 'react'
import FuelEntry from './FuelEntry'
import { totalCost, costPer100km, fmt } from '../utils/calc'

const EMPTY_ENTRY = { pricePerLiter: '', liters: '', km: '' }

export default function FuelSection({ title, colorClass, entries, setEntries }) {
  const add = () => setEntries([...entries, { ...EMPTY_ENTRY }])

  const update = (i, updated) =>
    setEntries(entries.map((e, idx) => (idx === i ? updated : e)))

  const remove = (i) =>
    setEntries(entries.filter((_, idx) => idx !== i))

  const c100 = costPer100km(entries)
  const total = totalCost(entries)

  return (
    <section className={`fuel-section ${colorClass}`}>
      <h2>{title}</h2>

      <div className="entries">
        {entries.length === 0 && (
          <p className="empty-hint">No entries yet. Add a fill-up below.</p>
        )}
        {entries.map((entry, i) => (
          <FuelEntry
            key={i}
            index={i}
            entry={entry}
            onChange={update}
            onRemove={remove}
          />
        ))}
      </div>

      <button className="btn-add" onClick={add}>+ Add fill-up</button>

      <div className="section-summary">
        <div className="stat">
          <span className="stat-label">Cost / 100 km</span>
          <span className="stat-value">{fmt(c100)} zł</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total spent</span>
          <span className="stat-value">{fmt(total)} zł</span>
        </div>
      </div>
    </section>
  )
}

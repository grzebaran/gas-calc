import React from 'react'

export default function FuelEntry({ entry, index, onChange, onRemove }) {
  const handle = (field) => (e) =>
    onChange(index, { ...entry, [field]: e.target.value })

  return (
    <div className="entry-row">
      <label>
        <span>Price / L</span>
        <input
          type="number"
          min="0"
          step="0.001"
          placeholder="0.000"
          value={entry.pricePerLiter}
          onChange={handle('pricePerLiter')}
        />
      </label>
      <label>
        <span>Liters</span>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={entry.liters}
          onChange={handle('liters')}
        />
      </label>
      <label>
        <span>KM driven</span>
        <input
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={entry.km}
          onChange={handle('km')}
        />
      </label>
      <button className="btn-remove" onClick={() => onRemove(index)} title="Remove">
        ✕
      </button>
    </div>
  )
}

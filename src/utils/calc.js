export function totalCost(entries) {
  return entries.reduce(
    (sum, e) => sum + (parseFloat(e.pricePerLiter) || 0) * (parseFloat(e.liters) || 0),
    0
  )
}

export function totalKm(entries) {
  return entries.reduce((sum, e) => sum + (parseFloat(e.km) || 0), 0)
}

export function costPer100km(entries) {
  const km = totalKm(entries)
  if (km === 0) return null
  return (totalCost(entries) / km) * 100
}

// Gasoline stats derived from LPG km values + per-entry price + global avg consumption
export function gasStats(lpgEntries, gasPrices, avgConsumption) {
  const consumption = parseFloat(avgConsumption) || 0
  let cost = 0
  let km = 0
  lpgEntries.forEach((lpgEntry, i) => {
    const entryKm = parseFloat(lpgEntry.km) || 0
    const liters = (entryKm / 100) * consumption
    const price = parseFloat(gasPrices[i]?.pricePerLiter) || 0
    cost += price * liters
    km += entryKm
  })
  return {
    totalCost: cost,
    costPer100km: km > 0 ? (cost / km) * 100 : null,
  }
}

export function fmt(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '—'
  return value.toFixed(decimals)
}

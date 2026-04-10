import React, { useState, useEffect, useRef } from 'react'
import FuelSection from './components/FuelSection'
import GasolineSection from './components/GasolineSection'
import Comparison from './components/Comparison'
import AuthForm from './components/AuthForm'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const [lpgEntries, setLpgEntriesState] = useState([])
  const [gasPrices, setGasPricesState] = useState([])
  const [avgConsumption, setAvgConsumptionState] = useState('')
  const [dataLoading, setDataLoading] = useState(false)
  const saveTimer = useRef(null)
  const avgTimer = useRef(null)

  useEffect(() => {
    if (!user) {
      setLpgEntriesState([])
      setGasPricesState([])
      setAvgConsumptionState('')
      return
    }

    async function load() {
      setDataLoading(true)
      const [{ data: entries }, { data: settings }] = await Promise.all([
        supabase.from('fuel_entries').select('*').eq('user_id', user.id).order('sort_order'),
        supabase.from('user_settings').select('avg_consumption').eq('user_id', user.id).single(),
      ])
      if (entries) {
        setLpgEntriesState(entries.map(e => ({
          pricePerLiter: e.lpg_price_per_liter ?? '',
          liters: e.liters ?? '',
          km: e.km ?? '',
        })))
        setGasPricesState(entries.map(e => ({
          pricePerLiter: e.gas_price_per_liter ?? '',
        })))
      }
      if (settings) {
        setAvgConsumptionState(String(settings.avg_consumption ?? ''))
      }
      setDataLoading(false)
    }

    load()
  }, [user])

  async function saveFuelEntries(lpg, gas) {
    await supabase.from('fuel_entries').delete().eq('user_id', user.id)
    if (lpg.length > 0) {
      await supabase.from('fuel_entries').insert(
        lpg.map((entry, i) => ({
          user_id: user.id,
          lpg_price_per_liter: entry.pricePerLiter === '' ? null : Number(entry.pricePerLiter),
          liters: entry.liters === '' ? null : Number(entry.liters),
          km: entry.km === '' ? null : Number(entry.km),
          gas_price_per_liter: gas[i]?.pricePerLiter === '' ? null : Number(gas[i]?.pricePerLiter),
          sort_order: i,
        }))
      )
    }
  }

  function saveFuelEntriesDebounced(lpg, gas) {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveFuelEntries(lpg, gas), 600)
  }

  const handleSetLpgEntries = (value) => {
    const next = typeof value === 'function' ? value(lpgEntries) : value
    let newGas = gasPrices
    if (next.length > gasPrices.length) {
      newGas = [...gasPrices, ...Array(next.length - gasPrices.length).fill({ pricePerLiter: '' })]
    } else if (next.length < gasPrices.length) {
      newGas = gasPrices.slice(0, next.length)
    }
    setLpgEntriesState(next)
    setGasPricesState(newGas)
    saveFuelEntriesDebounced(next, newGas)
  }

  const handleSetGasPrices = (value) => {
    const next = typeof value === 'function' ? value(gasPrices) : value
    setGasPricesState(next)
    saveFuelEntriesDebounced(lpgEntries, next)
  }

  const handleSetAvgConsumption = (value) => {
    setAvgConsumptionState(value)
    clearTimeout(avgTimer.current)
    avgTimer.current = setTimeout(() => {
      supabase.from('user_settings').upsert({
        user_id: user.id,
        avg_consumption: value === '' ? null : Number(value),
        updated_at: new Date().toISOString(),
      })
    }, 600)
  }

  if (authLoading) return <div className="loading-screen">Loading…</div>
  if (!user) return <AuthForm onSignIn={signIn} onSignUp={signUp} />

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>LPG Savings Calculator</h1>
          <p>Track and compare your fuel costs</p>
        </div>
        <div className="header-right">
          <span className="user-email">{user.email}</span>
          <button className="btn-signout" onClick={signOut}>Sign out</button>
        </div>
      </header>

      {dataLoading ? (
        <div className="loading-data">Loading your data…</div>
      ) : (
        <>
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
              setGasPrices={handleSetGasPrices}
              avgConsumption={avgConsumption}
              setAvgConsumption={handleSetAvgConsumption}
            />
          </main>
          <Comparison
            lpgEntries={lpgEntries}
            gasPrices={gasPrices}
            avgConsumption={avgConsumption}
          />
        </>
      )}
    </div>
  )
}

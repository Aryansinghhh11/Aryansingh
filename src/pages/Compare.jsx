import React, { useState } from 'react'
import mice from '../data/mice.json'

export default function Compare(){
  const [a,setA] = useState(mice[0].id)
  const [b,setB] = useState(mice[1]?.id || mice[0].id)
  const left = mice.find(m=>m.id===a)
  const right = mice.find(m=>m.id===b)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Compare</h2>
      <div className="mb-4 flex gap-4">
        <select value={a} onChange={e=>setA(e.target.value)} className="border p-2">
          {mice.map(m=> <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={b} onChange={e=>setB(e.target.value)} className="border p-2">
          {mice.map(m=> <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">{left.name}</h3>
          <ul className="text-sm text-slate-700 mt-2">
            <li>Type: {left.type}</li>
            <li>Sensor: {left.sensor}</li>
            <li>DPI: {left.dpi}</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">{right.name}</h3>
          <ul className="text-sm text-slate-700 mt-2">
            <li>Type: {right.type}</li>
            <li>Sensor: {right.sensor}</li>
            <li>DPI: {right.dpi}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

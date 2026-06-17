import React from 'react'
import mice from '../data/mice.json'

export default function Overview(){
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <p className="text-slate-600 mb-6">A catalog of computer mice — specs, anatomy, and buying guidance.</p>

      <div className="grid md:grid-cols-3 gap-4">
        {mice.map((m)=>(
          <article key={m.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{m.name}</h3>
            <p className="text-sm text-slate-600">{m.summary}</p>
            <div className="mt-2 text-sm text-slate-700">
              <div>Type: {m.type}</div>
              <div>DPI: {m.dpi}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

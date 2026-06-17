import React from 'react'
import mice from '../data/mice.json'

export default function Gallery(){
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {mice.map(m=> (
          <figure key={m.id} className="bg-white rounded shadow overflow-hidden">
            <img src={m.image} alt={m.name} className="w-full h-48 object-cover" />
            <figcaption className="p-3">
              <h4 className="font-semibold">{m.name}</h4>
              <p className="text-sm text-slate-600">{m.summary}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

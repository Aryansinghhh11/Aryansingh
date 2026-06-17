import React from 'react'
import Viewer from '../components/Viewer'
import mice from '../data/mice.json'

export default function Home(){
  const sample = mice[0]
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">{sample.name}</h1>
        <p className="text-slate-600 mb-4">{sample.summary}</p>
        <div className="space-y-2">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Quick Specs</h3>
            <ul className="text-sm text-slate-700 mt-2">
              <li>Type: {sample.type}</li>
              <li>Sensor: {sample.sensor}</li>
              <li>DPI: {sample.dpi}</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Interact with the 3D Viewer</h3>
            <p className="text-sm text-slate-700">Rotate, zoom, and click parts (buttons, wheel, body) to see info.</p>
          </div>
        </div>
      </section>

      <section>
        <Viewer />
      </section>
    </div>
  )
}

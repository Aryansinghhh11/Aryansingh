import React from 'react'

export default function Anatomy(){
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Anatomy & Specs</h2>
      <p className="text-slate-600">Click parts in the 3D viewer to learn more about each component (buttons, wheel, sensor, shell).</p>
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Common Parts</h3>
        <ul className="list-disc ml-6 text-slate-700">
          <li>Left / Right Buttons — primary input.</li>
          <li>Scroll Wheel — scroll and middle-click.</li>
          <li>Sensor — optical/laser sensor that tracks movement.</li>
          <li>Shell / Ergonomics — shape and fit for hands.</li>
        </ul>
      </div>
    </div>
  )
}

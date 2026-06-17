import React from 'react'

export default function FAQ(){
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">FAQ</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">How do I rotate the model?</h4>
          <p className="text-slate-600">Click and drag in the viewer, use scroll to zoom.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">Can I add my own mouse?</h4>
          <p className="text-slate-600">Yes — add entries to src/data/mice.json and images to public/.</p>
        </div>
      </div>
    </div>
  )
}

import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-slate-50 border-t">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} MouseInfo 3D — Built with React + Three.js
      </div>
    </footer>
  )
}

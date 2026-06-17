import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header(){
  const loc = useLocation()
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">MouseInfo 3D</Link>
        <nav className="space-x-4 text-sm">
          <Link to="/overview" className={loc.pathname==='/'?"":""}>Overview</Link>
          <Link to="/anatomy">Anatomy / Specs</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/resources">Resources</Link>
        </nav>
      </div>
    </header>
  )
}

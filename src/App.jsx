import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Overview from './pages/Overview'
import Anatomy from './pages/Anatomy'
import Gallery from './pages/Gallery'
import Compare from './pages/Compare'
import FAQ from './pages/FAQ'
import Resources from './pages/Resources'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/anatomy" element={<Anatomy />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

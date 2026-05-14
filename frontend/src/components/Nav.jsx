import React from 'react'
import logo from '../assets/LoadTally_logo.jpg' 

const Nav = () => {
  return (
    <div className='w-full h-16 bg-slate-100 shadow-gray-600 flex justify-center items-center shadow-sm'>
        <img src={logo} alt="Logo" className="h-full w-20" />
        <b className='text-4xl'>Load Tally</b>
    </div>
  )
}

export default Nav

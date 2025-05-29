import React from 'react'

const Footer = () => {
  return (
    <div className='bg-slate-800 text-white flex flex-col justify-center items-center w-full'>
      <div className="logo text-2xl font-bold text-white">
        <span className='text-blue-400'>&lt;</span>
        <span>Key</span>
        <span className='text-amber-400'>Guard</span>
        <span className='text-blue-400'>/&gt;</span>
      </div>

      <div className='flex justify-center items-center'>
        Created with <img className='w-7 mx-2' src="icons/heart.png" alt="heart" /> by Aakash S P
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-3 max-w-md">
        ⚠️ This app is for educational purposes only. Do not store real or sensitive passwords.
        All data is stored in plain text in the database and is not encrypted.
      </p>
    </div>
  )
}

export default Footer

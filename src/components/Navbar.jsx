import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-slate-800 text-white'>
            <div className='flex justify-between items-center p-3 container mx-auto h-14'>
                <div className="logo text-2xl font-bold">
                    <span className='text-blue-400'>&lt;</span>
                    <span>Key</span>
                    <span className='text-amber-400'>Guard</span>
                    <span className='text-blue-400'>/&gt;</span>
                </div>
                <a
                    href="https://github.com/aakashsp30/keyguard"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button className='bg-blue-700 rounded-full my-5 mx-2 flex justify-between items-center cursor-pointer ring-white ring-1 '>
                        <img className='invert w-10 p-1' src="icons/github.svg" alt="github" />
                        <span className='font-bold px-2'>GitHub</span>
                    </button>
                </a>
            </div>
        </nav>
    )
}

export default Navbar
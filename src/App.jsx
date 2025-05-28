import { useState, useEffect, useRef } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import Footer from './components/Footer';
import Swal from 'sweetalert2';

function App() {
  const toastSettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }

  const ref = useRef()
  const passwordRef = useRef()
  const [form, setForm] = useState({ site: "", username: "", password: "", id: null })
  const [passwordArray, setPasswordArray] = useState([])
  const [searchterm, setsearchTerm] = useState("")

  const getpasswords = async () => {
    let req = await fetch("http://localhost:3000/")
    let passwords = await req.json()
    setPasswordArray(passwords)
  }

  useEffect(() => {
    getpasswords()
  }, [])


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const savePassword = async () => {

    try {
      if (form.site.length <= 3 || form.username.length <= 3 || form.password.length <= 3) {
        toast.error('All fields must be longer than 3 characters');
        return
      }

      const idToUse = form.id || uuidv4()

      if (form.id) {
        await fetch("http://localhost:3000/", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: idToUse, site:form.site, username: form.username, password:form.password }) })
        toast('Password updated!', { ...toastSettings })
      }
      else {
        await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: idToUse }) })
        toast('Password saved!', { ...toastSettings })
      }

      await getpasswords()
      setForm({ site: "", username: "", password: "", id: null })
    } catch (error) {
      toast.error('Failed to save password');
    }
  }

  const editPassword = (id) => {
    const toEdit = passwordArray.find(i => i.id === id)
    setForm(toEdit)
  }

  const deletePassword = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This password will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

        await getpasswords()
        toast('Password Deleted!', { ...toastSettings })
      }
    })
  }

  const showpassword = () => {
    if (ref.current.src.includes("icons/eyecross.png")) {
      ref.current.src = "icons/eye.png"
      passwordRef.current.type = "text"
    }
    else {
      ref.current.src = "icons/eyecross.png"
      passwordRef.current.type = "password"
    }
  }

  const copyText = (text) => {
    toast('Copied to Clipboard!', { ...toastSettings })
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="absolute inset-0 -z-10 h-full w-full bg-blue-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div></div>

      <Navbar />
      <div className='p-5 min-h-[83.3vh]'>
        <h1 className="text-4xl font-bold text-center mt-2">
          <span className='text-blue-400'>&lt;</span>
          <span>Key</span>
          <span className='text-amber-400'>Guard</span>
          <span className='text-blue-400'>/&gt;</span>
        </h1>
        <p className='text-center text-blue-400 text-lg'>Your own Password Manager</p>
        <div className="flex flex-col gap-5 p-5 items-center">
          <input value={form.site} onChange={handleChange} className='bg-white rounded-full p-4 py-1 w-full border border-blue-400' type="text" name="site" id="site" placeholder='Enter Website URL' />
          <div className="flex flex-col md:flex-row gap-5">
            <input value={form.username} onChange={handleChange} className='bg-white rounded-full p-4 py-1 border border-blue-400' type="text" name="username" id="username" placeholder='Enter Username' />

            <div className="relative">
              <input ref={passwordRef} value={form.password} onChange={handleChange} className='bg-white rounded-full p-4 py-1 border border-blue-400' type="password" name="password" id="password" placeholder='Enter Password' />
              <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showpassword}>
                <img ref={ref} className='p-1' width={26} src="icons/eyecross.png" alt="eye" />
              </span>
            </div>
          </div>

          <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-blue-400 hover:bg-blue-300 hover:scale-[1.02] transition-all duration-200 border border-blue-400 px-8 py-2 rounded-full cursor-pointer text-xl font-bold'>
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover" >
            </lord-icon>
            Save
          </button>
        </div>

        <div className="passwords">
          <h2 className='font-bold text-xl py-4'>Your Passwords</h2>

          <input type="text" value={searchterm} onChange={(e) => setsearchTerm(e.target.value)} className='bg-white rounded-full p-4 py-1 w-full md:w-1/2 border border-blue-400 mb-4' placeholder='Search by site or username' />

          {passwordArray.length === 0 && <div> No passwords to show</div>}
          {passwordArray.length !== 0 && <table className="table-auto w-full overflow-hidden rounded-md mb-10">
            <thead className='bg-blue-800 text-white'>
              <tr>
                <th className='py-2'>Site</th>
                <th className='py-2'>Username</th>
                <th className='py-2'>Password</th>
                <th className='py-2'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-blue-200 md:text-base'>
              {passwordArray
                .filter(item =>
                (item.site?.toLowerCase().includes(searchterm.toLowerCase()) ||
                  item.username?.toLowerCase().includes(searchterm.toLowerCase()))
                )
                .map((item, index) => {
                  return <tr key={index} className='hover:bg-blue-300 transition-all duration-150'>
                    <td className='py-2 border border-white text-center'>
                      <div className="flex justify-center items-center">
                        <a href={item.site} target='_blank'>{item.site}</a>
                        <div className="lordiconcopy cursor-pointer size-7" onClick={() => copyText(item.site)}>
                          <lord-icon
                            style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover" >
                          </lord-icon>
                        </div>
                      </div>
                    </td>

                    <td className='py-2 border border-white text-center'>
                      <div className="flex justify-center items-center">
                        <span>{item.username}</span>
                        <div className="lordiconcopy cursor-pointer size-7" onClick={() => copyText(item.username)}>
                          <lord-icon
                            style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover" >
                          </lord-icon>
                        </div>
                      </div>
                    </td>

                    <td className='py-2 border border-white text-center'>
                      <div className="flex justify-center items-center">
                        <span>{"*".repeat(item.password.length)}</span>
                        <div className="lordiconcopy cursor-pointer size-7" onClick={() => copyText(item.password)}>
                          <lord-icon
                            style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover" >
                          </lord-icon>
                        </div>
                      </div>
                    </td>

                    <td className='py-2 border border-white text-center'>
                      <span className='cursor-pointer mx-1' onClick={() => editPassword(item.id)}>
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                          src="https://cdn.lordicon.com/gwlusjdu.json"
                          trigger="hover" >
                        </lord-icon>
                      </span>

                      <span className='cursor-pointer mx-1' onClick={() => deletePassword(item.id)}>
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover" >
                        </lord-icon>
                      </span>
                    </td>
                  </tr>
                })}
            </tbody>
          </table>}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App

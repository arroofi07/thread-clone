import { Link } from "react-router-dom"
import NavbarBottom from "../components/NavbarBottom"
import { AiOutlineClose } from "react-icons/ai"
import { useEffect, useState } from "react"
import axios from "axios"
import { ImAttachment } from 'react-icons/im'

interface User {
  id: number
  name: string,
}

function Postingan() {
  const [dataUser, setDataUser] = useState<User | null>(null)
  const userId = localStorage.getItem('user_id')
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("")

  useEffect(() => {
    fetchUser()
    const interval = setInterval(fetchUser, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])


  async function fetchUser() {
    const response = await axios.get(`http://localhost:3000/user/${userId}`)
    setDataUser(response.data)
  }



  // postingan features
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (file || text) {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (text) {
        formData.append("text", text)
      }
      try {
        await axios.post(`http://localhost:3000/user/file/${userId}`, formData);
        console.log('success')
        setText("")
        setFile(null)
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };


  return (
    <div  >
      <div className="text-rose-500 font-serif font-bold  flex space-x-5 ml-5 mt-7 mb-[-30px] " >
        <Link to='/home' >
          <p className="text-[27px] active:animate-ping cursor-pointer hover:text-white " ><AiOutlineClose /></p>
        </Link>
        <p className="text-[18px] capitalize " >postingan baru</p>
      </div>

      {dataUser !== null && (
        <div className="text-rose-500 capitalize pl-5 relative top-16  " >
          <ul className="flex relative top-8 space-x-4  " >
            <li
              id="box-image-share"
              className="bg-rose-700  items-center w-[50px] h-[50px] rounded-[80px] cursor-pointer  mt-[-32px]"
            ></li>
            <li className="text-[25px] relative -top-8 font-serif " >
              <p className="font-semibold" >{dataUser.name}</p>
              <form onSubmit={handleSubmit} >
                <textarea value={text} onChange={handleTextChange} placeholder="Kirim Postingan...." className="relative  bg-black focus:mb-6 w-[120%] resize-none text-white border-0 placeholder:opacity-60  text-[16px] outline-none  " />
                <label htmlFor="fileInput" className="relative -top-2 " ><ImAttachment /></label>
                <input id="fileInput" type="file" accept=".jpg, .jpeg, .png, gif, heic" onChange={handleFileChange} className="text-rose-600 relative hidden -top-6 " />
                <button
                  style={{ boxShadow: '0 0 20px red ' }}
                  className={`border-[1px] text-[20px] active:animate-ping text-center w-[60%]  mt-10 ml-[50px] font-serif font-semibold  border-slate-500 rounded-[10px] ${text !== "" || file !== null ? "" : "hidden"} `} type="submit"  >
                  Posting
                </button>
              </form>
            </li>
          </ul>
        </div>
      )
      }





      <NavbarBottom classNameHome="" classNameSearch="" classNameShare="text-rose-500" classNameFollower="" classNameProfile="" />
    </div >
  )
}

export default Postingan

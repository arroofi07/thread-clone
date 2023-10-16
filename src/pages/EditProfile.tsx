import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import bg from '../assets/bgUserGold.png'

interface User {
  id: number,
  name: string,
  profile: {
    id: number,
    alamat: string,
    bio: string,
    tautan: string,
    fileName: string
  }[]
}

const EditProfil = () => {
  const [file, setFile] = useState<File | null>(null)
  const [alamat, setAlamat] = useState<string>("")
  const [bio, setBio] = useState<string>("")
  const [tautan, setTautan] = useState<string>("")
  const [userData, setUserData] = useState<User | null>(null)
  const userId: any = localStorage.getItem("user_id")

  useEffect(() => {
    fetchUser()
    const interval = setInterval(fetchUser, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchUser = async () => {
    const response = await axios.get(`http://localhost:3000/user/${userId}`)
    setUserData(response.data)
  }




  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  const handleAlamatChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAlamat(event.target.value)
  };
  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value)
  };
  const handleTautanChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTautan(event.target.value)
  };

  const profileData = async (event: React.FormEvent) => {
    event.preventDefault()

    if (file || alamat || bio || tautan) {
      const formData = new FormData()
      if (file) {
        formData.append("file", file)
      }
      if (alamat) {
        formData.append("alamat", alamat)
      }
      if (bio) {
        formData.append("bio", bio)
      }
      if (tautan) {
        formData.append("tautan", tautan)
      }


      try {
        if (userData && userData.profile && userData.profile.length > 0) {
          await axios.patch(`http://localhost:3000/user/profile/updated/${userId}`, formData)
        } else {
          await axios.post(`http://localhost:3000/user/profile/${userId}`, formData)
        }
        console.log('success')
        setAlamat("")
        setBio("")
        setTautan("")
        setFile(null)
      } catch (err) {
        console.log('Erorr uploading file', err)
      }
    }
  }


  return (
    <>
      <div className="text-rose-500 font-serif font-bold  flex space-x-5 ml-5 mt-7 mb-[-30px] " >
        <Link to='/home/profile' >
          <p className="text-[27px] active:animate-ping cursor-pointer hover:text-white " ><AiOutlineClose /></p>
        </Link>
        <p className="text-[18px]" >Edit Profil</p>
      </div>
      {/*  */}

      <div className=" text-rose-500 w-[90%] h-[280px] relative  mt-[160px] ml-4 border-[1px] border-slate-400  rounded-xl " >
        <ul className="   w-full   ml-5 mt-4 " >
          <li className="">
            <form onSubmit={profileData} >
              {userData && userData.profile && userData.profile.length > 0 ? (
                userData.profile.map((data) => (
                  <div>
                    <label htmlFor="file" key={data.id}>
                      <img
                        src={`http://localhost:3000/user/profile/${data.fileName}`}
                        className=' items-center w-[50px] h-[50px] rounded-[80px] cursor-pointer'
                        alt="User Profile"
                      />
                    </label>
                    <br></br>
                    <input id="file" type="file" accept=".jpg, .jpeg, .png, gif, heic" onChange={handleFileChange} className="hidden" />
                    {/*  */}
                    {/* alamat */}
                    <label htmlFor="alamat" className="font-semibold  " >Alamat</label>
                    <br></br>
                    <textarea id="alamat" placeholder={data.alamat} value={alamat} onChange={handleAlamatChange} className="w-[88%] h-[30px] text-white border-[1px] p] resize-none t-2 outline-none border-t-0 border-l-0 border-r-0  border-slate-300 bg-black  " />
                    <br></br>
                    {/*  */}
                    {/* bio */}
                    <label htmlFor="alamat" className="font-semibold  " >Bio</label>
                    <br></br>
                    <textarea id="alamat" placeholder={data.bio} value={bio} onChange={handleBioChange} className="w-[88%] h-[30px] text-white border-[1px] p] resize-none t-2 outline-none border-t-0 border-l-0 border-r-0  border-slate-300 bg-black  " />
                    <br></br>
                    {/*  */}
                    {/* tautan */}
                    <label htmlFor="alamat" className="font-semibold  " >Tautan</label>
                    <textarea id="alamat" placeholder={data.tautan} value={tautan} onChange={handleTautanChange} className="w-[88%] h-[30px] text-white border-[1px] p] resize-none t-2 outline-none border-t-0 border-l-0 border-r-0  border-slate-300 bg-black  " />
                    <button
                      style={{ boxShadow: '0 0 25px red ' }}
                      className={`hover:border-white hover:border-[2px] border-[2px] text-[20px] active:animate-ping text-center w-[60%]  mt-10 ml-[55px] font-serif font-semibold  border-slate-500 rounded-[10px]  `} type="submit"  >
                      Send
                    </button>
                  </div>
                ))
              ) : (
                <div>
                  <label htmlFor="fileEmpty"  >
                    <img
                      src={bg}
                      className='items-center w-[50px] h-[50px] rounded-[80px] cursor-pointer'
                      alt="User Profile"
                    />
                  </label>
                  <br></br>
                  <input id="fileEmpty" type="file" accept=".jpg, .jpeg, .png, gif, heic" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="alamat" className="font-semibold  " >Alamat</label>
                  <br></br>
                  <textarea id="alamat" placeholder="masukkan alamatmu..." value={alamat} onChange={handleAlamatChange} className="w-[88%] h-[30px] text-white border-[1px] p] resize-none t-2 outline-none border-t-0 border-l-0 border-r-0  border-slate-300 bg-black  " />
                  <br></br>
                  <label htmlFor="bio" className="font-semibold  " >Bio</label>
                  <br></br>
                  <textarea id="bio" placeholder="masukkan Bio..." value={bio} onChange={handleBioChange} className="w-[88%] h-[30px] text-white border-[1px] p] resize-none t-2 outline-none border-t-0 border-l-0 border-r-0  border-slate-300 bg-black  " />
                  <br></br>
                  <label htmlFor="tautan" className="font-semibold  " >Tautan</label>
                  <br></br>
                  <textarea id="tautan" placeholder="masukkan Tautan..." value={tautan} onChange={handleTautanChange} className="w-[88%] h-[30px] text-white border-[1px] p] resize-none t-2 outline-none border-t-0 border-l-0 border-r-0  border-slate-300 bg-black  " />
                  <button
                    style={{ boxShadow: '0 0 25px red ' }}
                    className={`  border-[2px] text-[20px] active:animate-ping text-center w-[60%]  mt-10 ml-[50px] font-serif font-semibold  border-slate-500 rounded-[10px]  `} type="submit"  >
                    Send
                  </button>
                </div>
              )}


            </form>
          </li>


        </ul>
      </div>


    </>

  )
}

export default EditProfil

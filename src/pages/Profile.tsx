import { FC, useEffect, useState } from "react"
import NavbarBottom from "../components/NavbarBottom"
import axios from "axios"
import { Link } from "react-router-dom"
import { User } from "./Home"
import bg from '../assets/bgUserGold.png'




const Profile: FC = () => {
  const [activeBalasan, setActiveBalasan] = useState<boolean>(false)
  const [activePostingan, setActivePostingan] = useState<boolean>(false)
  const [dataUser, setDataUser] = useState<User | null>(null)
  const userId: any = localStorage.getItem("user_id")


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

  const handleActivebalsan = () => {
    setActiveBalasan(!activeBalasan)
    setActivePostingan(false)
  }

  const handleActivePostingan = () => {
    setActivePostingan(!activePostingan)
    setActiveBalasan(false)
  }

  return (
    <div className=" text-rose-500 font-serif w-full relative h-[100vh] bg-black -mt-[10px] -ml-[32px " >


      {dataUser !== null && (
        <div className="text-rose-500 font-serif capitalize pl-5 relative top-16  " >
          <ul>
            <li className="text-[30px] font-bold w-[160px] h-auto " >{dataUser.name}</li>
            <li className="text-[17px]" >{dataUser.followers.length} Pengikut</li>
          </ul>
        </div>
      )}



      {/* photo profile */}
      <div>
        {dataUser?.profile && dataUser.profile.length > 0 ? (
          dataUser.profile.map((dataProfile, key) => (
            <img
              key={key}
              id="box-image"
              className=" items-center w-[130px] h-[130px] rounded-[80px] cursor-pointer  ml-[220px] mt-[-32px]"
              src={`http://localhost:3000/user/profile/${dataProfile.fileName}`}
            />
          ))
        ) : (
          <img className=" items-center w-[130px] h-[130px] rounded-[80px] cursor-pointer  ml-[220px] mt-[-32px]" src={bg} />
        )}
      </div>

      {/* edot profil and share profil */}
      <div>
        <ul className=" text-[18px] font-serif w-full h-[130px] relative top-5 flex justify-center items-center space-x-10  " >
          <li className="bg-black w-[36%] active:animate-ping hover:bg-rose-500 hover:text-black border-white border-[1px] text-center rounded-xl ">
            <Link to="/home/profile/edit-profile">
              Edit Profil
            </Link></li>
          <li className="bg-black w-[36%] active:animate-ping hover:bg-rose-500 hover:text-black border-white border-[1px] text-center rounded-xl  " >Bagikan Profil</li>
        </ul>
      </div>

      {/* postingan dan balasan */}
      <div>
        <ul className="text-[18px] border-b-[1px] border-opacity-50 border-white font-serif w-full h-auto relative top-[25px] flex justify-center items-center space-x-1 " >
          <li onClick={handleActivePostingan} className={`w-[49%] h-10 text-center ${activePostingan ? "border-b-[1px] border-white  " : ""} `}>
            Postingan
          </li>
          <li onClick={handleActivebalsan} className={`w-[49%] h-10 text-center ${activeBalasan ? "border-b-[1px] border-white  " : ""} `}>
            Balasan
          </li>
        </ul>
      </div>

      {/* content */}
      {activePostingan && (
        <div className="w-full h-auto relative  " >
          {dataUser?.postings && dataUser?.postings.length > 0 ? (
            dataUser.postings.map((dataPost, key) => (
              <ul key={key} className=" pl-[13px] font-serif text-[15px] text-white h-auto border-b-[1px] border-white "  >
                <li className="mt-[50px] mb-3 ml-2" >{dataPost.text}</li>
                <li
                  style={{ boxShadow: "0 0 3px white" }}
                  className="bg-black  max-w-[360px]  rounded-[10px]  ">
                  {dataPost.fileName !== '' ? (
                    <img src={`http://localhost:3000/user/uploads/${dataPost.fileName}`} className="max-w-full max-h-[400px] rounded-[10px] " />
                  ) : (
                    null
                  )}
                </li>
                <li className="h-[20px]" ></li>
              </ul>
            ))
          ) : (
            <h1 className="capitalize text-center mt-[70px] " >anda belum memposting apapun</h1>
          )}
          <p className="h-[200px]" ></p>
        </div>
      )}



      {activeBalasan && (
        <div className="w-full h-auto relative top-[150px]">
          {dataUser && dataUser.postings.map((dataPost, key) => (
            <div key={key}>
              {dataPost.comment.length > 0 || dataUser.postings.length > 0 ? (
                <div className="space-y-5" >
                  {dataPost.comment.map((dataComment, unique) => (
                    <ul key={unique} className="space-y-4 border-b-[1px] mt-[-80px] border-white h-auto w-full " >
                      <li className="flex justify-start space-x-3 " >
                        {dataComment.photoProfile !== undefined ? (
                          <img className="w-[35px] h-[35px] ml-4 rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataComment.photoProfile}`} />
                        ) : (
                          <img className="w-[35px] h-[35px] ml-4 rounded-[80px] cursor-pointer" src={bg} />
                        )}
                        <p className="mt-1 capitalize font-semibold" >{dataComment.userName}</p>
                      </li>
                      <li className="pl-10 w-[95%] text-white" >{dataComment.text}</li>
                      <li className="h-4" ></li>
                    </ul>
                  ))}
                </div>
              ) : (
                <h1 className={`capitalize text-center mt-[70px] `}>Tidak ada balasan</h1>
              )}
              <p className="h-20" ></p>
            </div>
          ))}
        </div>

      )}


      <NavbarBottom classNameHome="" classNameSearch="" classNameShare="" classNameFollower="" classNameProfile="text-rose-500  " />
    </div>
  )
}

export default Profile

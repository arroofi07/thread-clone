import { useEffect, useState } from "react"
import { User } from "./Home"
import axios from "axios"
import NavbarBottom from "../components/NavbarBottom"
import bg from '../assets/bgUserGold.png'


function Folllowers() {
  const [userData, setUserData] = useState<User[]>([])
  const [activeFollowing, setActiveFollowing] = useState<boolean>(false)
  const [activeFollowing2, setActiveFollowing2] = useState<boolean>(false)
  const userId = localStorage.getItem('user_id')




  useEffect(() => {
    fetchUser()
    const interval = setInterval(fetchUser, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user")
      setUserData(response.data)
    } catch (err) {
      console.log('gagal mengambil data', err)
    }
  }


  const navItem = ['semua', 'diikuti', 'mengikuti']


  const handleActiveFollowing = async () => {
    setActiveFollowing(true)
    setActiveFollowing2(false)
  }

  const handleCloseFollowing = async () => {
    setActiveFollowing(false)
    setActiveFollowing2(false)
  }

  const handleActiveFollowing2 = async () => {
    setActiveFollowing2(true)
    setActiveFollowing(false)
  }


  return (
    <div className="font-serif" >
      <h1 className="text-white font-bold text-[25px] mt-3 ml-4  " >Aktivitas</h1>


      <nav className=" text-white w-full h-auto" >
        <ul className="flex space-x-5 pl-5 pt-4 capitalize text-[18px] font-serif  " >
          {navItem.map((item, key) => (
            <li
              onClick={
                item === 'semua' ? handleCloseFollowing :
                  item === 'mengikuti' ? handleActiveFollowing :
                    item === 'diikuti' ? handleActiveFollowing2 :
                      () => { }
              }
              key={key}
              className={`border-[1px] border-white rounded-[10px] text-center w-[100px] 
              ${!activeFollowing && !activeFollowing2 && item === 'semua' ? 'bg-white text-black ' : 'bg-none'}
              ${activeFollowing && item === 'mengikuti' ? 'bg-white text-black' : ''}
              ${activeFollowing2 && item === 'diikuti' ? 'bg-white text-black' : ''}
              `} >{item}</li>
          ))}
        </ul>
      </nav>
      <NavbarBottom classNameHome="" classNameSearch="" classNameShare="" classNameFollower="text-rose-600" classNameProfile="" />



      {/* diikuti dan mengikuti  */}
      {!activeFollowing && !activeFollowing2 && (
        <div className="text-rose-500" >
          {userData.map((data, key) => {
            const validateFollower = data.followers.length > 0 && data.followers.some(
              (f) => f.userId.toString() === userId?.toString()
            )
            const validateFollowing = data.following.length > 0
            const validateFollowing2 = data.following.some(
              (f) => f.userIdFollowing.toString() === userId?.toString()
            )
            if (validateFollower || validateFollowing && validateFollowing2) {
              return (
                <ul key={key} className="border-[1px] border-slate-500 w-[95%] rounded-[13px] inline-block mt-10 mb-[-10px] h-[50px] pt-1 pl-2 " >
                  <li className=" flex justify-start space-x-3  " >
                    <p>
                      {data.profile && data.profile.length > 0 ? (
                        data.profile.map((dataProfile, key) => (
                          <img key={key} className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataProfile.fileName}`} />
                        ))
                      ) : (
                        <img src={bg} className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer" />
                      )}
                    </p>
                    <p className="mt-2 font-semibold capitalize " >
                      {data.name}
                    </p>
                  </li>
                  <li className="ml-[200px] mt-[-30px] text-center text-white" >{data.followers.length.toString()} pengikut</li>
                </ul>
              )
            }
          })}
        </div>
      )
      }


      {/* diikuti */}
      {activeFollowing2 && (
        <div className="text-white  " >
          {userData.map((data, key) => {
            const validateFollow = data.following.find((f) => f.userIdFollowing.toString() === userId?.toString())

            if (validateFollow) {
              return (
                <ul key={key} className="border-[1px] border-slate-500 w-[95%] rounded-[13px] inline-block mt-10 mb-[-10px] h-[50px] pt-1 pl-2 " >
                  <li className=" flex justify-start space-x-3  " >
                    <p>
                      {data.profile && data.profile.length > 0 ? (
                        data.profile.map((dataProfile, key) => (
                          <img key={key} className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataProfile.fileName}`} />
                        ))
                      ) : (
                        <img src={bg} className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer" />
                      )}
                    </p>
                    <p className="mt-2 font-semibold text-rose-500 capitalize" >
                      {data.name}
                    </p>
                  </li>
                  <li className="ml-[200px] mt-[-30px] text-center text-white" >{data.followers.length.toString()} pengikut</li>
                </ul>
              )
            }
          })}
        </div>
      )}


      {/*  mengikuti */}
      {
        activeFollowing && (
          <div>
            {userData.map((data, key) => {
              const hasMatchingFollow = data.followers.length > 0 && data.followers.some(
                (f) => f.userId.toString() == userId?.toString()
              )

              if (hasMatchingFollow) {
                return (
                  <ul key={key} className="border-[1px] border-slate-500 w-[95%]  rounded-[13px] inline-block mt-10 mb-[-10px] h-[50px] pt-1 pl-2 " >
                    <li className=" flex justify-start space-x-3  " >
                      <p>
                        {data.profile && data.profile.length > 0 ? (
                          data.profile.map((dataProfile, key) => (
                            <img key={key} className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataProfile.fileName}`} />
                          ))
                        ) : (
                          <img src={bg} className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer" />
                        )}
                      </p>
                      <p className="mt-2 font-semibold text-rose-500 capitalize" >
                        {data.name}
                      </p>
                    </li>
                    <li className="ml-[200px] mt-[-30px] text-center text-white" >{data.followers.length.toString()} pengikut</li>
                  </ul>
                )
              }
            })}
          </div>
        )
      }




    </div >
  )
}

export default Folllowers

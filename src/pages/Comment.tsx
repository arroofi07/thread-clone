import React, { FC, useEffect, useState } from "react"
import { User } from "./Home"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { AiFillHeart, AiOutlineArrowLeft, AiOutlineClose, AiOutlineHeart } from "react-icons/ai"
import bg from '../assets/bgUserGold.png'
import { BsDot } from "react-icons/bs"
import { FaRegComment } from "react-icons/fa";



export const Comment: FC = () => {
  const [userData, setUserData] = useState<User | null>(null)
  const [userDataLogin, setUserDataLogin] = useState<User | null>(null)
  const [activeForm, setActiveForm] = useState<boolean>(false)
  const [showAllTextMap, setShowAllTextMap] = useState<Map<number, boolean>>(new Map())
  const userId: any = localStorage.getItem('user_id')
  const [text, setText] = useState<string>("")
  const postId = useParams().postId
  const userIdByParam = useParams().userId
  const fileNamePostingan = localStorage.getItem('fileNamePostingan')
  const textPostingan = localStorage.getItem("textPostingan")
  const likes = localStorage.getItem("likes")
  const comments = localStorage.getItem("comments")
  const navigate = useNavigate()
  // const location = useLocation()
  const photoProfile = userDataLogin?.profile.find((p) => p.fileName)
  const userNameLog = userDataLogin?.name


  useEffect(() => {
    fetchUser()
    fetchUserLogin()
    const interval = setInterval(fetchUser, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])



  // data user yang sedang loggin 
  const fetchUserLogin = async () => {
    try {
      const userResponse = await axios.get(`http://localhost:3000/user/${userId}`);
      setUserDataLogin(userResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


  const fetchUser = async () => {
    try {
      const userResponse = await axios.get(`http://localhost:3000/user/${userIdByParam}`);
      setUserData(userResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const handleComments = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text) {
      alert('masukkan komen anda terlebih dahulu')
    }


    try {
      await axios.post(`http://localhost:3000/user/comments/${postId}/${userId}/${photoProfile?.fileName}/${userNameLog}`, {
        text: text
      })
      setText("")
      setActiveForm(false)
    } catch (error) {
      console.error("Error uploading file:", error);
    }

  };


  const handleLikesComment = async (likedCommentsId: number, commentId: number) => {
    const token = localStorage.getItem('access_token')
    try {
      const response = await axios.post(`http://localhost:3000/user/likesComments`,
        {
          liking: userId,
          likedCommentsId: likedCommentsId,
          commentId: commentId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data)
    } catch (err) {
      console.error(err)
    }
  }


  function handleActiveForm() {
    setActiveForm(!activeForm)
  }


  const handleShowAllText = (id: number) => {
    setShowAllTextMap((prev) => {
      const newShowAllText = new Map(prev)
      newShowAllText.set(id, true)
      return newShowAllText
    })
  }




  return (
    <div className=" text-white h-auto font-serif " >
      <nav className="text-rose-500 font-serif font-bold  flex space-x-5 ml-5 mt-7 mb-[-30px] "  >
        {!activeForm ? (
          <p onClick={() => {
            localStorage.removeItem('fileNamePostingan')
            localStorage.removeItem('textPostingan')
            localStorage.removeItem('comments')
            localStorage.removeItem('likes')
            navigate('/home')
          }} className="text-[27px] active:animate-ping cursor-pointer hover:text-white " >
            <AiOutlineArrowLeft />
          </p>
        ) : (
          <p
            onClick={handleActiveForm}
            className="text-[27px] active:animate-ping cursor-pointer hover:text-white ">
            <AiOutlineClose />
          </p>
        )}
        <p>Postingan</p>
      </nav>



      {/* postingqn user */}
      <div className=" relative mb-[-45px] top-[50px] w-full  " >
        <ul className="" >
          <li className=' flex space-x-3 mb-3 ml-4 '>
            <div>
              {userData?.profile && userData.profile.length > 0 ? (
                userData?.profile.map((dataProfile) => (
                  <img className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataProfile.fileName}`} alt="" />
                ))
              ) : (
                <img className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer border-[1px] border-white" src={bg} />
              )}
            </div>
            <p className="capitalize mt-1 text-rose-500 font-semibold " >
              {userData?.name}
            </p>
          </li>
          <li className=" w-[95%] text-left ml-4 mb-4 ">
            <p>{textPostingan}</p>
          </li>
          <li className="  flex justify-center mb-4 ">
            <div className="bg-black border-[1px] max-w-[360px] border-white rounded-[10px] " >
              {fileNamePostingan ? (
                <img className="max-w-full max-h-[400px] rounded-[10px] " src={`http://localhost:3000/user/uploads/${fileNamePostingan}`} />
              ) : (
                null
              )}
            </div>
          </li>
          <li className="ml-[25px] font-serif -mt-2 text-[17px] flex opacity-60  " >
            <h3 className="text-[18px] mt-1 ml-1 flex space-x-2 " >
              <p>{likes}</p>
              <p>suka</p>
            </h3>
            <p className="mt-3  text-[18px] " >
              <BsDot />
            </p>
            <h3 className="text-[18px] mt-1  flex space-x-2" >
              <p>{comments}</p>
              <p>balasan</p>
            </h3>
          </li>
        </ul>
      </div>


      {/*  */}
      {/* comments postingan */}
      {!activeForm && (
        <div className="relative h-auto top-[120px] mb-[-100px]">
          {userData?.postings.map((dataPost, key) => (
            <ul key={key} className="space-y-7">
              {dataPost.comment.map((dataComment, unique) => {
                if (dataComment.postId.toLocaleString() === postId) {
                  const newLikesStatus = dataComment.likedComments.find((f) => f.likesStatus == true && f.liking == userId);

                  return (
                    <div key={unique} className="space-y-5" >
                      <li className="space-y-2 border-t-[1px] pt-3 flex space-x-4 ">
                        {dataComment.photoProfile.length > 0 ? (
                          <img className="w-[35px] h-[35px] ml-4 rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataComment.photoProfile}`} alt="" />
                        ) : (
                          <img className="w-[35px] h-[35px] ml-4 rounded-[80px] cursor-pointer" src={bg} alt="" />
                        )}
                        <p>
                          {dataComment.userName}
                        </p>
                      </li>
                      <li>
                        <p
                          style={{
                            maxHeight: showAllTextMap.get(dataComment.id) ? "none" : "4.5em",
                            overflow: "hidden",
                            position: "relative",
                          }}
                          className="ml-7 w-[87%] mb-[-25px] "
                        >
                          {dataComment.text}
                        </p>
                      </li>
                      <li className="text-rose-500 ml-7 mb-[-30px] flex justify-end mr-10">
                        {dataComment.text.length > 70 && !showAllTextMap.get(dataComment.id) && (
                          <button type="button" onClick={() => handleShowAllText(dataComment.id)}>
                            Selengkapnya
                          </button>
                        )}
                      </li>
                      <li className="flex text-[20px] mt-10 ml-6 space-x-5 w-[20px]">
                        <div onClick={() => handleLikesComment(dataComment.id, dataComment.id)}>
                          {newLikesStatus ? (
                            <p className="text-rose-600 cursor-pointer">
                              <AiFillHeart />
                            </p>
                          ) : (
                            <p className="cursor-pointer">
                              <AiOutlineHeart />
                            </p>
                          )}
                        </div>
                        <div>
                          <p
                            style={{ transform: 'scaleX(-1)', cursor: 'pointer' }}
                            onClick={() => {
                              localStorage.setItem('textComments', dataComment.text),
                                localStorage.setItem('userName', dataComment.userName),
                                localStorage.setItem('photoProfileComment', dataComment.photoProfile)
                              localStorage.setItem('likesComment', dataComment.likedComments.length.toLocaleString())
                              localStorage.setItem('jumlahComment', dataComment.nextedComments.length.toLocaleString())
                              navigate(`/home/nextedComments/${dataComment.id}/${userIdByParam}`);
                            }}
                            className="w-[20px]"
                          >
                            <FaRegComment />
                          </p>
                        </div>
                      </li>
                      <li className="ml-7 space-x-2 text-[14px] opacity-60 mt-3 flex justify-start items-center ">
                        <p>{dataComment.likedComments.length} <span className="ml-1" >Suka</span> </p>
                        <p className="mt-[-5px]" >.</p>
                        <p>{dataComment.nextedComments.length} <span className="ml-1" >Balasan</span> </p>
                      </li>
                    </div>
                  );
                }
                return null
              })}
            </ul>
          ))}
          <p className="h-[120px]"></p>
        </div>
      )}








      {/*  */}
      {activeForm && (
        <div className=" w-full h-[200px] items-center justify-center relative top-[120px] text-white " >
          <ul className="space-y-4" >
            <li className="ml-5 flex space-x-3 " >
              {userDataLogin?.profile && userDataLogin.profile.length > 0 ? (
                userDataLogin?.profile.map((dataProfileLogin) => (
                  <img className=" w-[35px] h-[35px] rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataProfileLogin.fileName}`} alt="" />
                ))
              ) : (
                <img className=" w-[35px] h-[35px] rounded-[80px] cursor-pointer border-[1px] border-white" src={bg} />
              )}
              <label className="capitalize mt-2 text-rose-500 font-semibold " >{userDataLogin?.name}</label>
            </li>
            <li>
              <form onSubmit={handleComments} >
                <li>
                  <textarea
                    placeholder='Balas postingan'
                    className="resize-none bg-black w-[75%] ml-16 outline-none " value={text} onChange={(event) => setText(event.target.value)} />
                </li>
                <li className={`bg-gray-700 w-full fixed bottom-0  h-[65px] flex justify-end  font-semibold  `} >
                  {text.length > 0 && (
                    <button type="submit" className="text-rose-600 z-50 font-serif text-[25px]  hover:text-white mr-8 bg- " >Send</button>
                  )}
                </li>
              </form>
            </li>
          </ul>
        </div>
      )}




      {!activeForm && (
        <div className={` fixed bottom-7 w-full `} >
          <ul
            className="text-white border-[1px] border-white font-serif flex justify-start pl-2 space-x-5 items-center w-[90%] ml-[18px] rounded-[27px] h-[50px]  top-2  relative  resize-none bg-gray-700 "
            onClick={handleActiveForm}>
            <li>
              {userDataLogin?.profile && userDataLogin.profile.length > 0 ? (
                userDataLogin?.profile.map((dataProfileLogin) => (
                  <img className=" w-[35px] h-[35px] rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataProfileLogin.fileName}`} alt="" />
                ))
              ) : (
                <img className=" w-[35px] h-[35px] rounded-[80px] cursor-pointer border-[1px] border-white" src={bg} />
              )}
            </li>
            <li className="opacity-50" >Balas Postingan</li>
          </ul>
        </div>
      )}


    </div>
  )
}




import React, { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useNavigate, useParams } from "react-router-dom"
import { User } from "./Home"
import axios from "axios"
import bg from '../assets/bgUserGold.png'
import { AiOutlineArrowLeft } from "react-icons/ai"
import { BsDot } from "react-icons/bs"



function NextedComments() {
  const [userData, setUserData] = useState<User | null>(null)
  const [showAllTextMap, setShowAllTextMap] = useState<Map<number, boolean>>(new Map())
  const [userDataByPar, setUserDataByPar] = useState<User | null>(null)
  const [text, setText] = useState<string>("")
  const [activeForm, setActiveForm] = useState<boolean>(false)
  const textComments = localStorage.getItem('textComments')
  const navigate = useNavigate()
  const userIdByParam = useParams().userId
  const commentId = useParams().commentsId
  const user_id = localStorage.getItem('user_id')
  const userNameComment = localStorage.getItem('userName')
  const photoProfileComment = localStorage.getItem('photoProfileComment')
  const jumlahLikes = localStorage.getItem('likesComment')
  const jumlahKomen = localStorage.getItem('jumlahComment')
  const photoProfile = userData?.profile.find((p) => p.fileName)
  const userNamelog = userData?.name




  useEffect(() => {
    fehtchUser()
    fetcUserByParam()
    const interval = setInterval(() => [
      fehtchUser(), fetcUserByParam()
    ], 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])


  const fehtchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${user_id}`)
      setUserData(response.data)
    } catch (err) {
      console.log('gagal mendapatkan data comment', err)
    }
  }

  const fetcUserByParam = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${userIdByParam}`)
      setUserDataByPar(response.data)
    } catch (err) {
      console.log('gagal mendapatkan data user', err)
    }
  }

  const handleNextedComments = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!text) {
      alert('masukkan komentar anda terlebih dahulu')
    }

    try {
      await axios.post(`http://localhost:3000/user/nextedComments/${commentId}/${userIdByParam}/${photoProfile?.fileName}/${userNamelog}`, {
        text: text
      })
      setText("")
      setActiveForm(false)
      console.log('succes')
    } catch (err) {
      console.log('gagal menambahkan comment', err)
    }

  }


  const handleActiveForm = () => {
    setActiveForm(!false)
  }

  const handleShowText = async (id: number) => {
    setShowAllTextMap((prev) => {
      const newShowAllText = new Map(prev)
      newShowAllText.set(id, true)
      return newShowAllText
    })
  }


  return (
    <div className="h-auto w-full  " >

      <nav className="text-rose-500 text-[26px] font-serif font-bold  flex space-x-5 ml-5 mt-7 mb-[-30px] " >
        {activeForm ? (
          <p onClick={() => setActiveForm(false)}  >
            <AiOutlineClose />
          </p>
        ) : (
          <p onClick={() => {
            localStorage.removeItem('textComments')
            localStorage.removeItem('userName')
            localStorage.removeItem('photoProfileComment')
            localStorage.removeItem('likesComment')
            localStorage.removeItem('jumlahComment')
            navigate(-1)
          }} >
            <AiOutlineArrowLeft />
          </p>
        )}

      </nav>


      <div className="text-white  mt-16 border-b-[1px] w-full border-white h-auto pb-4 " >
        <ul className="space-y-5  " >
          <li className="flex space-x-4" >
            <p>
              <img className="w-[35px] h-[35px] ml-4 rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${photoProfileComment}`} alt="" />
            </p>
            <p className="mt-1" >
              {userNameComment}
            </p>
          </li>
          <li className=" w-[94%] ml-2 " >{textComments}</li>
          <li className="ml-[25px] font-serif -mt-2 text-[17px] flex opacity-60  space-x-1 " >
            <p>{jumlahLikes}<span className="pl-2" >suka</span></p>
            <p className="mt-1" ><BsDot /></p>
            <p>{jumlahKomen}<span className="pl-2" >balasan</span></p>
          </li>
        </ul>
      </div>


      {/* input nexted comment */}
      {activeForm && (
        < div className=" w-full h-[200px] items-center justify-center relative top-[120px] " >
          {userData?.profile.map((dataProfile) => (
            <img className="w-[35px] h-[35px] ml-4 rounded-[80px] cursor-pointer mb-5 " src={`http://localhost:3000/user/profile/${dataProfile.fileName}`} />
          ))}
          <form onSubmit={handleNextedComments} className="inline-block  space-y-10 w-full " >
            <ul>
              <li>
                <textarea
                  placeholder="Kirimkan Balasan"
                  className=" w-[70%] h-[70px] ml-[40px] resize-none bg-transparent text-white outline-none "
                  onChange={(event) => setText(event.target.value)}
                  value={text}
                />
              </li>
              <li className="bg-slate-700 font-serif text-[20px] text-rose-500 w-full h-[50px] fixed bottom-0 flex items-center justify-end  " >
                {text !== "" && (
                  <button type="submit" className="bg-black font-semibold text-center w-[70px] rounded-[10px] mr-5  " >Send</button>
                )}
              </li>
            </ul>
          </form>
        </div>
      )
      }



      {
        !activeForm && (
          <div onClick={handleActiveForm} className="fixed bottom-7 w-full z-50" >
            <ul className=" border-[1px] border-white font-serif flex justify-start pl-2 space-x-5 items-center w-[90%] ml-[18px] rounded-[27px] h-[50px]  top-2  relative  resize-none bg-gray-700 " >
              <li  >
                {userData?.profile && userData.profile.length > 0 ? (
                  userData.profile.map((dataProfile) => (
                    <img className=" w-[35px] h-[35px] rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataProfile.fileName}`} />
                  ))
                ) : (
                  <img className="w-[35px] h-[35px] rounded-[80px] cursor-pointer " src={bg} />
                )}
              </li>
              <li className="text-slate-400" >
                Balas Komentar
              </li>
            </ul>
          </div>
        )
      }



      {/* daftar nextedComments  */}
      {!activeForm && (
        <div className=" mt-10 text-white w-full h-auto">
          {userDataByPar?.postings?.map((dataPost, key) => (
            <div key={key}>
              {dataPost.comment?.map((dataComment, unique) => (
                <div key={unique} className="space-y-5 " >
                  {dataComment.nextedComments?.map((dataNextComment, unique2) => {
                    if (dataNextComment.commentId.toLocaleString() == commentId) {
                      return (
                        <ul key={unique2} className='space-y-5 border-b-[1px] border-white ' >
                          <li className="flex space-x-3  " >
                            <img className="w-[35px] h-[35px] ml-4 rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataNextComment.photoProfile}`} />
                            <p className="mt-1" >
                              {dataNextComment.userName}
                            </p>
                          </li>
                          <li
                            style={{
                              maxHeight: showAllTextMap.get(dataNextComment.id) ? 'none' : "4.5em",
                              overflow: 'hidden',
                              position: 'relative'
                            }}
                            className=" w-[93%] ml-5  " >
                            {dataNextComment.text}
                          </li>
                          <li className=" flex justify-end mr-7 capitalize text-rose-500 font-semibold "  >
                            {dataNextComment.text.length > 70 && !showAllTextMap.get(dataNextComment.id) && (
                              <button type="button" onClick={() => handleShowText(dataNextComment.id)} >
                                Selengkapnya
                              </button>
                            )}
                          </li>
                          <li className="h-1" ></li>
                        </ul>
                      )
                    }
                  })}
                  <p className="h-10" ></p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}



    </div >
  )
}

export default NextedComments

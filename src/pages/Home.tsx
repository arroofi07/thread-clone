import { FC, useEffect, useState } from "react"
import NavbarBottom from "../components/NavbarBottom"
import { IoLogoReact } from "react-icons/io5";
import axios from "axios";
import bg from '../assets/bgUserGold.png'
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BsDot } from "react-icons/bs";


export interface User {
  id: number,
  name: string,
  followers: {
    id: number;
    userId: number
    userIdFollowing: number
    followStatus: boolean
  }[];
  following: {
    id: number;
    userId: number
    userIdFollowing: number
    followStatus: boolean
  }[];
  postings: {
    id: number,
    text: string,
    originalName: string,
    fileName: string
    filePath: string
    liked: {
      id: number
      liking: number
      postinganId: number
      likesStatus: boolean
    }[]
    comment: {
      id: number
      text: string
      userId: number
      photoProfile: string,
      postId: number
      userName: string
      likedComments: {
        id: number,
        liking: number,
        likesStatus: boolean
        commentId: number
      }[]
      nextedComments: {
        id: number
        text: string
        photoProfile: string
        userId: number
        commentId: number
        userName: string
      }[]
    }[]
  }[],
  profile: {
    fileName: string
    userId: number
  }[]
  showAllText: any
}



const Home: FC = () => {
  const [userData, setUserData] = useState<User[]>([])
  const [showAllTextMap, setShowAllTextMap] = useState<Map<number, boolean>>(new Map());
  const userId: any = localStorage.getItem('user_id')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
    const interval = setInterval(fetchUser, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])


  const fetchUser = async () => {
    try {
      const userResponse = await axios.get<User[]>(`http://localhost:3000/user`);
      // const randomDataArray = randomData(userResponse.data);
      setUserData(userResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleLikes = async (likedId: number, postId: number) => {
    const token = localStorage.getItem("access_token")
    await axios.post(`http://localhost:3000/user/likes`,
      {
        liking: userId,
        likedId: likedId,
        postinganId: postId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    // setLikes(response.data)
    // console.log('success likes', response.data)
  }



  const handleShowAllText = (id: number) => {
    setShowAllTextMap((prevShowAllTextMap) => {
      const newShowAllTextMap = new Map(prevShowAllTextMap);
      newShowAllTextMap.set(id, true);
      return newShowAllTextMap;
    });
  };






  return (
    <div className=" text-white  w-full relative h-[100vh] bg-black -mt-[10px] -ml-[32px " >
      {/* navbar top */}
      <nav className="bg-black text-[35px] flex justify-center items-center text-rose-600 w-full h-[60px] relative  top-2 " >
        <IoLogoReact />
      </nav>
      {/*  */}
      <NavbarBottom classNameHome="text-rose-600 " classNameSearch="" classNameShare="" classNameFollower="" classNameProfile="" />
      {/*  */}



      {/* content */}
      <div className="space-y-10 relative top-1 z-10 font-serif " >
        {userData.map((data, dataKey) => {
          // const likesStatus = data.liked.find((liked) => liked.likesStatus === true)
          const validateFollowing = data.followers.length > 0 && data.followers.some(
            (f) => f.userId.toString() === userId
          )
          const validateFollower = data.followers.some(
            (f) => f.userIdFollowing.toString() === userId
          )
          if (validateFollowing || validateFollower) {
            return (
              <ul key={dataKey} className="space-y-10  " >
                {data.postings.map((dataPost, postKey) => {
                  const newLikesStatus = dataPost.liked.find((liked) => liked.likesStatus === true && liked.liking == userId)
                  return (
                    <ul key={postKey} className="border-b-[1px] border-white" >
                      <li id='box-image' className=' flex space-x-3 mb-3 ml-4 '>
                        {data.profile && data.profile.length > 0 ? (
                          data.profile.map((dataProfile, unique) => (
                            <img key={unique} className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer" src={`http://localhost:3000/user/profile/${dataProfile.fileName}`} alt="" />
                          ))
                        ) : (
                          <img className=" w-[40px] h-[40px] rounded-[80px] cursor-pointer border-[1px] border-white" src={bg} />
                        )}
                        <h2 className="capitalize" >{data.name}</h2>
                      </li>
                      <li>
                        {dataPost.text && dataPost.text.length > 0 && (
                          <div
                            style={{
                              maxHeight: showAllTextMap.get(dataPost.id) ? "none" : "4.5em",
                              overflow: "hidden",
                              position: "relative"
                            }}>
                            <p className=" w-[95%] text-left ml-3  " >
                              {dataPost.text}
                            </p>
                          </div>
                        )}
                      </li>
                      <li className="mb-3 flex justify-end items-center " >
                        {dataPost.text.length > 70 && !showAllTextMap.get(dataPost.id) && (
                          <button
                            type="button"
                            onClick={() => handleShowAllText(dataPost.id)}
                            className="text-rose-500 mr-5  "
                          >
                            Selengkapnya....
                          </button>
                        )}
                      </li>
                      <li className="  flex justify-center mb-4 " >
                        {dataPost.fileName.length > 0 && dataPost.fileName ? (
                          <div
                            style={{ boxShadow: "0 0 3px white" }}
                            className="bg-black border-[1px] max-w-[360px] border-white rounded-[10px] " >
                            <img
                              src={`http://localhost:3000/user/uploads/${dataPost.fileName}`}
                              className="max-w-full max-h-[400px] rounded-[10px] "
                            />
                          </div>
                        ) : null}
                      </li>
                      <li>
                        <ul className="mb-4 flex justify-start items-center space-x-4 text-[22px] ml-14   " >
                          <li onClick={() => handleLikes(dataPost.id, dataPost.id)} className="text-[24px] cursor-pointer " >
                            {newLikesStatus ? (
                              <p className="text-red-600" >
                                <AiFillHeart />
                              </p>
                            ) : (
                              <AiOutlineHeart />
                            )}
                            {/* <p>{dataPost.liked.length}</p> */}
                          </li>
                          <li onClick={() => {
                            localStorage.setItem('fileNamePostingan', dataPost.fileName)
                            localStorage.setItem('textPostingan', dataPost.text)
                            localStorage.setItem('likes', dataPost.liked.length.toString())
                            localStorage.setItem('comments', dataPost.comment.length.toString())
                            navigate(`/home/comment/${dataPost.id}/${data.id}`)
                          }} >
                            <FaRegComment style={{ transform: 'scaleX(-1)', cursor: 'pointer' }} />
                          </li>
                        </ul>
                      </li>
                      <li className="ml-[55px] -mt-2 text-[17px] flex opacity-60  " >
                        <h3 className="text-[14px] mt-1 ml-1 flex space-x-2 " >
                          <p>{dataPost.liked.length}</p>
                          <p>suka</p>
                        </h3>
                        <p className="mt-2" >
                          <BsDot />
                        </p>
                        <h3 className="text-[14px] mt-1 ml-1 flex space-x-2" >
                          <p>{dataPost.comment.length}</p>
                          <p>balasan</p>
                        </h3>
                      </li>
                      <p className="h-[20px]" ></p>
                    </ul>
                  )
                })}
              </ul>
            )
          }
        })}
        <p className="h-[70px]" ></p>
      </div>


    </div >
  )
}

export default Home

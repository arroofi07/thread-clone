import { FC, useEffect, useState } from 'react';
import NavbarBottom from '../components/NavbarBottom';
import { GoSearch } from 'react-icons/go';
import axios from 'axios';
import bg from '../assets/bgUserGold.png'

interface User {
  id: number;
  name: string;
  followStatus: boolean;
  followers: {
    id: number;
    userId: number
    userIdFollowing: number
    followStatus: boolean;
    created_at: string;
    updated_at: string;
  }[];
  following: {
    id: number;
    userId: number
    userIdFollowing: number
    followStatus: boolean;
    created_at: string;
    updated_at: string;
  }[];
  profile: {
    fileName: string
    userId: number
  }[]
}

const Search: FC = () => {
  const [iconSearch, setIconSearch] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('')
  // const [activeUnfollow, setActiveUnfollow] = useState<{ [userId: number]: boolean }>({});
  const loggedInUserId: any = localStorage.getItem('user_id'); // User ID for the logged-in user

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [searchTerm]);

  async function fetchUsers() {
    try {
      const response = await axios.get<User[]>('http://localhost:3000/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Data Users Not Found', error);
    }
  }

  const handleFollow = async (followerId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `http://localhost:3000/user/follow`,
        {
          followingId: parseInt(loggedInUserId),
          followerId: followerId,
          userId: loggedInUserId,
          userIdFollowing: followerId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };



  return (
    <div className='text-rose-500 font-serif w-full relative h-[100vh] bg-black -mt-[10px] -ml-[32px '>
      {/* input search */}
      <div className='relative w-[100%] text-center font-serif top-10 inline justify-center items-center'>
        <label className='font-bold ml-5 text-[28px]'>Cari</label>
        <input
          onFocus={() => setIconSearch(true)}
          onBlur={() => setIconSearch(false)}
          placeholder='Cari....'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-[90%] h-[35px] ml-4 placeholder:pl-5 mt-3 bg-slate-800 rounded-[7px] border-[1px] pl-3 border-white text-white'
        />
        {!iconSearch && (
          <h1 className='text-white ml-6 -mt-[25px]'>
            <GoSearch />
          </h1>
        )}
      </div>

      {/* tampil user random */}
      <div className='w-full h-auto relative inline-block space-y-4 justify-center items-center top-[100px]'>
        {users.filter((data) => data.name.toLowerCase().includes(searchTerm.toLowerCase())).map((data, key) => {
          const newFollowStatus = data.followers.find((follow) => follow.followStatus === true && follow.userId == loggedInUserId)
          // const followersUser = data.followers.find((follow) => follow.id === loggedInUserId)
          // const followingUser = data.following.find((follow) => follow.id === loggedInUserId)
          return (
            <>
              {data.id != loggedInUserId && (
                <ul key={key} className='border-b-[0.5px] pt-2 pl-3 flex border-gray-500 w-full h-auto '>
                  {data.profile && data.profile.length > 0 ? (
                    data.profile.map((dataProfile, unique) => (
                      <img key={unique} className=' items-center w-[40px] h-[40px] rounded-[80px] cursor-pointer' src={`http://localhost:3000/user/profile/${dataProfile.fileName}`} />
                    ))
                  ) : (
                    <img className=' items-center w-[40px] h-[40px] rounded-[80px] cursor-pointer' src={bg} />
                  )}

                  <li>
                    {/* <h2 className='font-bold capitalize ml-[10px] text-[19px]'>{data.followStatus}</h2> */}
                    <h2 className='font-bold capitalize w-[80%] ml-[10px] text-[19px]'>{data.name}</h2>
                    <h3 className='ml-[10px] text-white'>{data.followers.length} pengikut</h3>
                  </li>
                  <button
                    onClick={() => handleFollow(data.id)}
                    className={`
                    font-semibold text-white active:animate-ping absolute text-[16px] pt-[3px] ml-[250px] border-[1px] hover:bg-rose-700 hover:text-white h-[30px] w-[27%] rounded-[10px] text-center ${newFollowStatus ? 'hover:bg-slate-700' : ''} }`}
                  >
                    <p className={`${newFollowStatus ? 'text-red-500 opacity-70  ' : ''}`} >
                      {newFollowStatus ? 'mengikuti' : 'ikuti'}
                    </p>
                  </button>
                </ul>
              )}
            </>
          )
        })}
        <p className='h-48' ></p>
      </div>

      <NavbarBottom classNameHome='' classNameSearch='text-rose-500' classNameShare='' classNameFollower='' classNameProfile='' />
    </div>
  );
};

export default Search;

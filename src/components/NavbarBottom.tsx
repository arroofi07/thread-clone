import { GoHomeFill, GoSearch, GoHeart } from "react-icons/go";
import { CiShare1 } from "react-icons/ci";
import { BsPerson } from "react-icons/bs";
import { Link } from "react-router-dom";
import { FC } from "react";


interface NavbarNavBottomProps {
  classNameHome: string
  classNameSearch: string
  classNameShare: string
  classNameFollower: string
  classNameProfile: string
}

const NavbarBottom: FC<NavbarNavBottomProps> = ({ classNameHome, classNameSearch, classNameShare, classNameFollower, classNameProfile }) => {
  const NavbarNavBottom = [
    {
      ikon: <GoHomeFill className={`${classNameHome}`} />,
      url: "/home"
    },
    {
      ikon: <GoSearch className={`${classNameSearch}`} />,
      url: '/home/search'
    },
    {
      ikon: <CiShare1 className={`${classNameShare}`} />,
      url: '/home/share'
    },
    {
      ikon: <GoHeart className={`${classNameFollower}`} />,
      url: '/home/follow'
    },
    {
      ikon: <BsPerson className={`${classNameProfile}`} />,
      url: '/home/profile'
    }





  ];

  return (
    <>
      <div className="bg-black fixed bottom-0 pt-2 w-[113%] z-50  -ml-30 h-[60px]">
        <ul className="flex justify-center items-center font-extrabold text-gray-400 text-[37px] mt-1 space-x-10 -ml-[50px] " >
          {NavbarNavBottom.map((list, key: number) => (
            <Link to={list.url} key={key} >
              <li className="hover:text-white active:animate-ping ">{list.ikon}</li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}

export default NavbarBottom;

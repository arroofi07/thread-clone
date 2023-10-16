import { FC, useState } from "react";
import Typewriter from "typewriter-effect";
import bg from "../assets/sakura.jpg";
import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";

interface UserDto {
  name: string
  password: string
}

export const Login: FC = () => {
  const [eye, setEye] = useState<boolean>(false);
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {

    const data: UserDto = {
      name,
      password
    }

    try {
      const response = await axios.post(`http://localhost:3000/user/login`, data);

      if (response.data) {
        alert("Your Logged In");
        localStorage.setItem("secretKey", "utawl0705200420040507aiueo")
        localStorage.setItem("access_token", response.data.token);
        localStorage.setItem("user_id", response.data.user.id);
        navigate("/home")
      } else {
        alert("Username/Password False");

      }
      setName('')
      setPassword('')
    } catch (error) {
      console.log(error)
    }

  }

  const handleEye = () => {
    setEye(!eye);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPositionX: "-14px",
        backgroundPositionY: "-150px",
        boxShadow: "0 0 50px red",
      }}
      className="mt-[40%] pl-2  font-serif bg-black text-center text-[22px] rounded-[14px] border-[2px] text-rose-600 border-rose-700 items-center w-[100%]     "
    >
      <h1
        style={{ textShadow: "0 0 10px black" }}
        className="mb-4 mt-3 text-[30px] font-semibold"
      >
        <Typewriter
          options={{
            strings: ["Login"],
            autoStart: true,
            loop: true,
          }}
        />
      </h1>
      <div className="mb-4 ">
        <label htmlFor="username" className="text-white">
          Uername
        </label>
        <br></br>
        <input
          id="username"
          type="text"
          placeholder="Username"
          style={{ boxShadow: "0 0 100px red" }}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="text-white pl-2  focus:placeholder:text-transparent placeholder:text-rose-700 border-rose-700 border-[2px] rounded-[7px] bg-black  "
        />
      </div>
      <div className="mb-10 ml-1 ">
        <label htmlFor="password" className="text-white">
          Password
        </label>
        <br></br>
        <input
          id="password"
          type={eye ? "password" : "text"}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{ boxShadow: "0 0 100px red" }}
          className="text-white pl-2 focus:placeholder:text-transparent placeholder:text-rose-700 border-rose-700 border-[2px] rounded-[7px] bg-black  "
        />
      </div>
      <button
        type="button"
        onClick={handleLogin}
        className="mb-6 text-[18px] border-[2px] text-white border-rose-700 rounded-lg w-[18%] -ml-[45%] hover:text-black hover:bg-rose-700 hover:animate-bounce active:animate-ping "
      >
        Login
      </button>
      <Link to='/register' >
        <button
          type="button"
          className="mb-6 text-[18px] border-[2px] text-white border-rose-700 rounded-lg w-[24%] ml-[15%] -mr-[150px] hover:text-black hover:bg-rose-700 hover:animate-bounce active:animate-ping "
        >
          Register
        </button>
      </Link>

      <h1
        onClick={handleEye}
        className=" w-[7%] absolute -mt-[31.5%] ml-[65%] "
      >
        {eye ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
      </h1>
    </div>
  );
}

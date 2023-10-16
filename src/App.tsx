import { FC, useEffect } from "react";
import "./App.css";
import { Login } from "./pages/Login";
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Register } from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import EditProfil from "./pages/EditProfile";
import Postingan from "./pages/Postingan";
import { Comment } from "./pages/Comment";
import NextedComments from "./pages/NextedComments";
import Folllowers from "./pages/Folllowers";
import isMobile from 'is-mobile'


// import "bootstrap/dist/css/bootstrap.min.css";

const App: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIN = localStorage.getItem("secretKey")
    const currenPath = window.location.pathname;

    if (isLoggedIN === "utawl0705200420040507aiueo") {
      if (currenPath === '/' || currenPath === '/register') {
        navigate('/home', { replace: true })
      }
    } else {
      if (
        currenPath !== "/" &&
        currenPath !== "/register"
      ) {
        navigate("/", { replace: true });
      }
    }

  })

  return (
    <>
      {isMobile() ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/comment/:postId/:userId" element={<Comment />} />
          <Route path="/home/nextedComments/:commentsId/:userId" element={<NextedComments />} />
          <Route path="/home/search" element={<Search />} />
          <Route path="/home/share" element={<Postingan />} />
          <Route path="/home/follow" element={<Folllowers />} />
          <Route path="/home/profile" element={<Profile />} />
          <Route path="/home/profile/edit-profile" element={<EditProfil />} />
        </Routes>
      ) : (
        <h1 className="text-center text-[100px] pl-10 pt-10  text-rose-500 " >Website hanya bisa diakses melalui perangkat mobile</h1>
      )}


    </>
  );
}

export default App;

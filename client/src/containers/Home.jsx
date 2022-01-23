import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi/";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Router, Routes } from "react-router-dom";
import { Sidebar, Login, UserProfile } from "../components";

import { client } from "../client";
import logo from "../Assest/logo.png";
import { userQuery } from "../utils/data";
import Pins from "./Pins";
import { fetchUser } from "../utils/fetchUser";

const Home = () => {
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [user, setUser] = useState(null);
  const userInfo = fetchUser();

  const scrollRef = useRef(null);

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);
    client
      .fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);
  console.log(user);
  return (
    <div className=" flex bg-grey-50 md:flex-row flex-col h-screen transition-height duration-75 easy-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setSideBarToggle(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-16 rounded-full" />
            {/* <h1>{user?.userName}</h1> */}
          </Link>
        </div>
        {sideBarToggle && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => {
                  setSideBarToggle(false);
                }}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setSideBarToggle} />
          </div>
        )}
      </div>

      <div className="pb-2 flex-1 h-screen overflow-y-scroll " ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch, IoMdAdd } from "react-icons/io";

const NavBar = ({ searchTerm, setsearchTerm, user }) => {
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setsearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex gap-3">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img
            src={user?.image}
            alt="user-logo"
            className="rounded-full w-16"
          />
        </Link>
        <Link
          to="/create-pin"
          className="bg-black text-white rounded-lg w-12 h-12 md:w-14 md:h-14 items-center justify-center flex p-1 "
        >
          <IoMdAdd fontSize={30} />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;

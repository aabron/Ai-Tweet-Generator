import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiSun } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Navbar = ({setDarkMode, darkMode, logout}) => {
  const nav = useNavigate();
  return (
    <nav className="bg-white dark:bg-black relative  border-b-2 border-t-2 dark:border-blue-500 border-black w-full border-opacity-30 font-quicksand z-50 items-center">
        <div className=" max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-between h-24 text-black dark:text-white">
                <div className="text-2xl">
                  <Link to="/" className="hover:scale-105 duration-300 ease-in-out">AI Tweet Generator</Link>
                </div>
                <div className="text-2xl flex flex-row">
                    {darkMode ? (<FaMoon size={36} onClick={() => setDarkMode(!darkMode)} className="mt-2 hover:text-blue-500 duration-300 ease-in-out" />) : (<CiSun size={45} onClick={() => setDarkMode(!darkMode)} className="mt-2 hover:text-blue-500 duration-300 ease-in-out" />)}
                    <Link to="/generator/1" className="hover:text-blue-500 ml-20 font-bold duration-300 ease-in-out py-3">Generator</Link>
                    {/* <Link to="/about" className="hover:text-blue-500 ml-20 font-bold duration-300 ease-in-out py-3">About</Link> */}
                    {localStorage.getItem('token') ? <button onClick={() => (logout(), nav('/login'))} className="hover:bg-white hover:text-black dark:hover:text-blue-500 ml-20 font-bold dark:hover:bg-black py-3 px-5 bg-blue-500 dark:bg-slate-900 rounded-lg duration-300 ease-in-out">Logout</button> :<Link to="/signup" className="hover:bg-white hover:text-black ml-20 font-bold dark:hover:text-blue-500 py-3 px-5 bg-blue-500 dark:bg-slate-900 rounded-lg duration-300 ease-in-out">Signup</Link> }
                    {localStorage.getItem('token') ? <Link to="/settings" className="hover:text-blue-500 ml-16 font-bold py-3 px-5 rounded-lg duration-300 ease-in-out"><IoPerson size={36}/></Link> : null}
                </div>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;
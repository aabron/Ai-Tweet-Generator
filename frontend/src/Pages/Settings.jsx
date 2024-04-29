import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Settings = ({setDarkMode, darkMode, logout, twitterInfo, setTwitterInfo}) => {
    const [api, setApi] = useState('');
    const [access, setAccess] = useState('');
    const [accessSecret, setAccessSecret] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            const response = await axios({
                method: 'get',
                url: 'http://127.0.0.1:8001/api/getTweetSettings/',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
            })
            setUsername(response.data.username);
            setEmail(response.data.email);
            setApi(response.data.twitter_key);
            setApiSecret(response.data.twitter_secret);
            console.log(response.data)
        }
        fetchSettings();
    }, [])

    const handleApiChange = (e) => {
        setApi(e.target.value);
    };

    const handleApiSecretChange = (e) => {
        setApiSecret(e.target.value);
    };

    const handleApiAccessChange = (e) => {
        setAccess(e.target.value);
    };

    const handleApiAccessSecretChange = (e) => {
        setAccessSecret(e.target.value);
    };


    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleDarkModeChange = () => {
        setDarkMode(!darkMode);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const response = axios({
            method: 'post',
            url: 'http://127.0.0.1:8001/api/setTweetCodes/',
            data: {
                twitter_key: api,
                twitter_secret: apiSecret,
                username: username,
                email: email,
                password: password
            },
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'content-type': 'multipart/form-data',
            }
        });
    };

    return (
        <div className="flex flex-col dark:bg-black bg-white dark:text-white">
            <Navbar setDarkMode={setDarkMode} darkMode={darkMode} logout={logout}/>
            <div className='flex h-[91vh]'>
                <div className='w-full h-full flex justify-center items-center flex-col text-center'>
                    {api.length < 1 || api === "null" && <p className="text-red-500">API Key is required please input first</p>}
                    <h1 className="text-2xl font-bold mb-4 text-center">Settings</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="twitter_key" className="block font-medium">Twitter Api Key:</label>
                            <input type="text" id="twitter_key" value={api} onChange={handleApiChange} className="border text-center border-gray-300 rounded-md px-24 py-2 mt-1 w-full" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Twitter_secret_key" className="block font-medium">Twitter Secret Key:</label>
                            <input type="text" id="Twitter_secret_key" value={apiSecret} onChange={handleApiSecretChange} className="border text-center border-gray-300 rounded-md px-24 py-2 mt-1 w-full" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="twitter_access_key" className="block font-medium">Twitter Api Access Key:</label>
                            <input type="text" id="twitter_access_key" value={access} onChange={handleApiAccessChange} className="border text-center border-gray-300 rounded-md px-24 py-2 mt-1 w-full" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Twitter_access_secret" className="block font-medium">Twitter Secret Access Key:</label>
                            <input type="text" id="Twitter_access_secret" value={accessSecret} onChange={handleApiAccessSecretChange} className="border text-center border-gray-300 rounded-md px-24 py-2 mt-1 w-full" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="username" className="block font-medium">Username:</label>
                            <input type="text" id="username" value={username} onChange={handleUsernameChange} className="border text-center border-gray-300 rounded-md px-24 py-2 mt-1 w-full" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="darkMode" className="block font-medium">Dark Mode:</label>
                            <input type="checkbox" id="darkMode" checked={darkMode} onChange={handleDarkModeChange} className="mt-1" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block font-medium mb-3">Reset Password Link</label>
                            <Link to="" className="text-center rounded-md px-24 py-2 mt-3 text-lg text-blue-500 " >Reset Password</Link>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
                    </form>
                </div>
                
            </div>
        </div>
    );
};

export default Settings;
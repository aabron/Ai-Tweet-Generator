import React, { useEffect, useState } from 'react';
import { DynamicFakeTweet, FakeTweet } from '../Components/Tweets/FakeTweet';
import Navbar from '../Components/Navbar';
import { Slide } from 'react-slideshow-image';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const Home = ({setDarkMode, darkMode, setConvoId, convoId, logout, twitterInfo, setTwitterInfo}) => {
    const nav = useNavigate();
    const [query, setQuery] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [tweets, setTweets] = useState([]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {

        const response = axios({
            method: 'get',
            url: 'http://127.0.0.1:8001/api/getTweetData/',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        setTweets((await response).data);
        console.log((await response).data)
        }
        fetchData();
    }, []);

    const handleGenerateTweet = async () => {
        // console.log(localStorage.getItem('token'));
        try {
            const response = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8001/api/OPAICreateConvo/',
                data: { query: query },
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                withCredentials: true,

            });
            const response_payload = response.data["response-payload"]
            const conversationResponse = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8001/api/addTweetConversation/',
                data: { response_payload: response_payload, query: query},
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'content-Type': 'multipart/form-data',
                },
            });
            let convo_id = conversationResponse.data.id;
            console.log(convo_id);
            nav(`/generator/${convo_id}`);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(tweets)

    return (
        <>
        <Navbar setDarkMode={setDarkMode} darkMode={darkMode} logout={logout}/>
        <div className="dark:bg-black bg-white w-full h-screen flex flex-col justify-center items-center font-quicksand">
            <img
            className="absolute top-8 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px "
            src={require("../assets/img/pattern_react.png")}
            alt="..."
            />
            <h1 className='text-4xl font-semibold pb-20'> Tweet Generator </h1>
            <div className='z-50 w-full flex flex-col justify-center items-center px-24'>
                <input type="text" value={query} onChange={handleInputChange} className='border-2 border-black w-[50%] mx-auto mb-12 h-16 px-2 rounded-lg' placeholder='Input Prompt'/>
                <h2 className='text-2xl font-semibold mb-3'>Most recent tweet generated by a user!</h2>
                <div className="container mx-auto justify-center items-center w-[100%] px-48 z-10 mb-10">
                    <DynamicFakeTweet tweetText={tweets[tweets.length - 1]?.tweet_text} username={tweets[tweets.length - 1]?.tweet_username} name={tweets[tweets.length - 1]?.tweet_user_name}/>
                    
                </div>
                <button disabled={query.length <= 0} className=' disabled:bg-gray-600 disabled:hover:text-black mt-12 text-2xl bg-blue-500 hover:bg-white dark:hover:text-black text-black px-4 py-5 dark:text-white hover:text-blue-500 rounded-lg font-bold duration-300 ease-in-out' onClick={handleGenerateTweet}>Generate Tweet</button>
            </div>
            
        </div>
        </>
    );
};

export default Home;
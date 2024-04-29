import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Navbar from '../Components/Navbar';
import { FakeTweet } from '../Components/Tweets/FakeTweet';
import { Link } from 'react-router-dom';
import {DynamicFakeTweet} from '../Components/Tweets/FakeTweet';
import axios from 'axios';

const Landing = ({setDarkMode, darkMode, logout}) => {
    const [tweets, setTweets] = React.useState([]);

    React.useEffect( () => {
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

    const slideImages = [
        'tweet1.jpg',
        'tweet2.jpg',
        'tweet3.jpg'
    ];

    return (
        //this is the landing page, the empty tags are just to represent an empty parent group
        <>
            <Navbar setDarkMode={setDarkMode} darkMode={darkMode} logout={logout}/>
            <div className="dark:bg-black bg-white w-full h-screen flex flex-col justify-center font-quicksand">
                <img
                className="absolute top-8 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px"
                src={require("../assets/img/pattern_react.png")}
                alt="..."
                />
                <div className='mb-12 z-30 dark:bg-transparent bg-white mx-96 rounded-lg dark:rounded-none dark:mx-0 border-black border-2 py-3 dark:border-0'>
                    <h1 className="dark:text-white text-black text-6xl font-bold text-center">AI Tweet Generator</h1>
                    <p className="dark:text-white text-black text-2xl font-normal text-center mt-2">Get your tweets written for you then post them from here!</p>
                </div>
                <div className="container mx-auto justify-center items-center w-[50%] z-10 mb-10">
                    <Slide>
                        {/* This is the slider for the tweets, 
                        it will display the tweets in a slideshow 
                         */}
                        
                        {tweets?.map((tweet, index) => {
                                return <div key={index} className='each-slide-effect'><DynamicFakeTweet key={index} tweetText={tweet.tweet_text} username={tweet.tweet_username} name={tweet.tweet_user_name}/></div>;
                        })}
                        
                    </Slide>
                    
                </div>
                <div className="flex container mx-auto justify-center items-center w-full z-10 text-2xl">
                    <Link to="/home" className="hover:bg-white hover:text-black text-white font-bold mx-auto py-3 px-5 bg-blue-500 rounded-lg duration-300 ease-in-out">Try it Out</Link>
                </div>
            </div>
        </>
    );
};

export default Landing;
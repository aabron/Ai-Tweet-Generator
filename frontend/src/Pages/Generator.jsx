import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BsFillChatLeftTextFill, BsSend } from 'react-icons/bs';
import 'react-loader-spinner';
import { Circles } from 'react-loader-spinner';
import Navbar from '../Components/Navbar';
import ConversationList from '../Components/Lists/ConversationList';
import { DynamicFakeTweet } from '../Components/Tweets/FakeTweet';
import Modal from 'react-modal';

const Generator = ({ setDarkMode, darkMode, logout, twitterInfo, setTwitterInfo }) => {
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { convo_id } = useParams();
  const [activeTab, setActiveTab] = useState('conversations');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState('');
  const [posted, setPosted] = useState(false);
  const [user, setUser] = useState({});
  const resultDict = {};
  const nav = useNavigate();

  const handleCloseModal = () => {
    setLoading(false);
    setFailed(false);
    setPosted(false);
    setPosting(false);
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const handleConversationCreation = async () => {
    try {
      const response = await axios({
          method: 'post',
          url: 'http://127.0.0.1:8001/api/OPAICreateConvo/',
          data: { query: "Tweet Convo" },
          headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
          },
          withCredentials: true,

      });
      const response_payload = response.data["response-payload"]
      const conversationResponse = await axios({
          method: 'post',
          url: 'http://127.0.0.1:8001/api/addTweetConversation/',
          data: { response_payload: response_payload, query: "Can you Help me with a tweet?"},
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

  useEffect(() => {
    const fetchData = async () => {
      // console.log(localStorage.getItem('token'));
      try {
        const response = await axios({
          method: 'get',
          url: 'http://127.0.0.1:8001/api/getConversation/',
          params: { convo_id: convo_id },
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')} `
          },
        });
        
        const accountResponse = axios({
            method: 'get',
            url: 'http://127.0.0.1:8001/api/getUserData/',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        setUser((await accountResponse).data);
        // console.log((await accountResponse).data);
        // console.log(response);
        setConversation(response.data);
        setMessages(response.data.messages)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
        clearInterval(interval);
    };
  }, [convo_id]);
  

  const handleSendMessage = async () => {
    axios({
        method: 'post',
        url: `http://127.0.0.1:8001/api/updateTweetConversation/`,
        data: {
          content: message,
          sender: "user",
          convo_id: convo_id
        },
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'content-type': 'multipart/form-data'
        },
      })
      .then(response => {
        console.log('Message added successfully:', response.data);
      })
      .catch(error => {
        console.error('Error adding message:', error);
      });
    const query = message;
    setLoading(true);
    const response = await axios({
      method: 'post',
      url: 'http://127.0.0.1:8001/api/OPAIEndpointExisting/',
      data: {query: query + "INCLUDE ONLY THE TEXT FOR THE TWEET NOTHING ELSE", convo_id: convo_id},
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'content-type': 'multipart/form-data'
      },
    });
    const response_payload = response.data["response-payload"]
    // console.log(response_payload);
    await axios({
        method: 'post',
        url: `http://127.0.0.1:8001/api/updateTweetConversation/`,
        data: {
          content: response_payload,
          sender: "assistant",
          convo_id: convo_id
        },
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'content-type': 'multipart/form-data'
        },
      })
      .then(response => {
        console.log('Message added successfully:', response.data);
        setTimeout(()=> setLoading(false), 3000);
        
      })
      .catch(error => {
        console.error('Error adding message:', error);
      });
  };

  const handlePostTweet = async (index) => {
    setPosting(true);
    try {
      const localResponse = axios({
        method: 'post',
        url: 'http://127.0.0.1:8001/api/createTweet/',
        data: {
          tweet_text: messages[index].content,
        },
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'content-type': 'multipart/form-data'
        }
      })
      const response = axios({
        method: 'post',
        url: 'http://127.0.0.1:8001/api/postTweet/',
        data: {
          tweet_text: messages[index].content,
        },
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'content-type': 'multipart/form-data'
        }
      })
      setFailed(false);
      setPosting(false);
      setPosted(true);
    } catch (error) {
      console.error('Error posting tweet:', error);
      setError(error);
      setPosting(false);
      setFailed(true);
    }
    
  };

  return (
    <div className="flex flex-col h-full bg-blue-500 dark:bg-slate-900 text-black dark:text-white font-quicksand">
      <Modal
              isOpen={posting}
              onRequestClose={handleCloseModal}
              style={customStyles}
              contentLabel="loading"
          >
                  <div className="flex flex-col items-center justify-center h-40 w-80 text-center">
                      <p>Posting Tweet....</p>
                      <Circles color="#0066FF" height={90} width={90} />
                  </div>
      </Modal>
      <Modal
              isOpen={failed}
              onRequestClose={handleCloseModal}
              style={customStyles}
              contentLabel="loading"
          >
                  <div className="flex flex-col items-center justify-center h-40 w-80 text-center">
                      <h2 className="text-3xl font-extrabold text-gray-900">Post Failed: {error}</h2>
                      <button onClick={handleCloseModal} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Close</button>
                  </div>
      </Modal>
      <Modal
              isOpen={posted}
              onRequestClose={handleCloseModal}
              style={customStyles}
              contentLabel="loading"
          >
                  <div className="flex flex-col items-center justify-center h-40 w-80 text-center">
                      <h2 className="text-3xl font-extrabold text-gray-900">Tweet Posted! check your Twitter account </h2>
                      <button onClick={handleCloseModal} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Close</button>
                  </div>
      </Modal>
      <Navbar setDarkMode={setDarkMode} darkMode={darkMode} logout={logout} />
      <div className='flex flex-row'>
        <nav className='inline-block h-full w-max bg-inherit my-16'>
          <h1 className='text-center text-2xl font-bold'>Conversations</h1>
          <div className='max-h-[90vh] overflow-y-auto no-scrollbar flex items-center justify-center flex-col'>
            <button onClick={handleConversationCreation} className='flex justify-center items-center p-4 px-24 rounded-md mt-4 font-quicksand hover:scale-95 hover:ease-in-out hover:duration-300 scale-100 duration-300 ease-in-out text-xl text-center shadow-lg border-2 border-black border-opacity-10 dark:border-2 dark:border-white dark:border-opacity-10'> + </button>
            <ConversationList />
          </div>
          <div className='max-h-[36rem] overflow-y-auto no-scrollbar'>
          </div>
        </nav>
        <div className="flex bg-white dark:bg-black dark:text-white min-h-screen dark:transition-colors dark:duration-300 transition-colors duration-300 ease-in-out dark:ease-in-out mt-0 w-full">
          <div className="flex-1 flex flex-col relative h-full max-h-screen">
            <div className="p-4 overflow-y-auto sticky mt-24 w-full inline-grid grid-flow-row">
              {/* Conversation Area */}
              {messages &&
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 border rounded-lg p-4 h-auto w-max sm:max-w-[30vh] md:max-w-[80vh] max-w-[100vh] ${
                      msg.sender === 'user'
                        ? 'ml-auto bg-black text-white dark:text-black dark:bg-slate-300'
                        : 'mr-auto bg-blue-500 text-black dark:bg-slate-900 dark:text-white'
                    }`}
                  >
                    {msg.sender === 'assistant' && index === messages.length - 1 ? (
                      <>
                        {loading ? (
                          <Circles color="#00BFFF" height={80} width={80} />
                        ) : (
                          <>
                          <DynamicFakeTweet tweetText={msg.content} username={user.username} name={user.user_name}/>
                          <button onClick={() => handlePostTweet(msg.index)} className='px-2 py-3 text-xl bg-black shadow-xl text-white dark:text-white dark:bg-blue-500 mt-2 rounded-lg hover:scale-105 duration-300 ease-in-out'>Post Tweet</button>
                          </>
                        )
                      }
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                ))}
            </div>
            <div className="p-4 flex items-center bg-[#FAF9F6] dark:bg-slate-800 absolute w-full dark:text-black">
              {/* Input Area */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-4 mr-2 rounded-md border border-black dark:border-gray-600 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="flex items-center justify-center h-auto p-4 rounded-lg relative bg-black dark:bg-slate-300 hover:scale-105 hover:transform hover:duration-300 transform duration-300 text-white dark:text-black text-md"
              >
                <BsSend className="mr-2" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
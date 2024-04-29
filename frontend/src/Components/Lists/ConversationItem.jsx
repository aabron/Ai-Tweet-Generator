import React from 'react';
import { Link, useNavigate  } from 'react-router-dom';

const Conversation = ({ data }) => {
  const firstMessage = data.messages.length > 0 ? data.messages[0].content : '';
  const nav = useNavigate();
  //setData(data);
  
  const handleConversationClick = async (values) => {
    const id = data.id;
    nav(`/generator/${id}`);
  }

  return (
      <div on onClick={handleConversationClick} className="flex justify-center items-center p-4 rounded-md my-4 font-quicksand hover:scale-95 hover:ease-in-out hover:duration-300 scale-100 duration-300 ease-in-out text-xl text-center shadow-lg border-2 border-black border-opacity-10 dark:border-white dark:border-2 dark:border-opacity-10">
        <p className="text-black mb-2 dark:text-blue-200">{firstMessage}</p>
      </div>
    
  );
}

export default Conversation;
import React from 'react';
import { CommentBubbleIcon, HeartIcon, RepostIcon, AnalyticsIcon } from '../../assets/Tweet Icons/Icons';

export const FakeTweet = () => {
    return (
        <div className="flex p-12 border dark:border-gray-300 border-black bg-white rounded-lg text-2xl">
            <img
                className="w-12 h-12 rounded-full mr-4"
                src="profilepic.png"
                alt="Profile Picture"
            />
            <div className="flex flex-col">
                <div className="flex flex-col items-start mb-2">
                    <span className="font-bold mr-2 text-3xl">John Doe</span>
                    <span className="text-gray-500">@johndoe</span>
                </div>
                <p className="mb-2 font-semibold">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    adipiscing elit. Sed Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    adipiscing elit. Sed
                </p>
                <div className="flex items-center text-gray-500">
                    <CommentBubbleIcon />
                    <span className="mr-6">100</span>
                    <RepostIcon />
                    <span className="mr-6">50</span>
                    <HeartIcon />
                    <span className="mr-6">50</span>
                    <AnalyticsIcon />
                </div>
            </div>
        </div>
    );
};

export const DynamicFakeTweet = ({tweetText, username, name}) => {
    return (
        <div className="flex p-12 border dark:border-gray-300 border-black bg-white rounded-lg text-2xl text-black">
            <img
                className="w-12 h-12 rounded-full mr-4"
                src={require("../../assets/img/profilepic.png")}
                alt="Profile Picture"
            />
            <div className="flex flex-col">
                <div className="flex flex-col items-start mb-2">
                    <span className="font-bold mr-2 text-3xl">{name}</span>
                    <span className="text-gray-500">@{username}</span>
                </div>
                <p className="mb-2 font-semibold">
                    {tweetText}
                </p>
                <div className="flex items-center text-gray-500">
                    <CommentBubbleIcon />
                    <span className="mr-6">100</span>
                    <RepostIcon />
                    <span className="mr-6">50</span>
                    <HeartIcon />
                    <span className="mr-6">50</span>
                    <AnalyticsIcon />
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import MessageItem from "./messageItem";

const Messages = ({messages}) => {
    return (
        <div>
            {
                messages.map(message => (
                    <MessageItem message = {message} key = {message.id}/>
                ))
            }
        </div>
    );
};

export default Messages;
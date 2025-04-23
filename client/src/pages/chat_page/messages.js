import React, {useEffect, useRef} from 'react';
import MessageItem from "./messageItem";

const Messages = ({messages}) => {

    const bottomRef = useRef(null);

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            if (bottomRef.current) {
                bottomRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        });

        return () => cancelAnimationFrame(raf);
    }, [messages]);


    return (
        <>
            <div style={{overflowY: "scroll", overflowX: "hidden"}}>
                {
                    messages.map(message => (
                        <MessageItem message={message} key={message.id}/>
                    ))
                }
                <div ref={bottomRef}/>
            </div>
        </>
    )
};

export default Messages;
import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {useParams} from "react-router-dom";
import Messages from "./messages";
import SendMessage from "./sendMessage";

const Index = () => {

    const {socketStore} = useContext(Context)
    const {id} = useParams()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!socketStore.socket) return
        const socket = socketStore.socket

        socket.emit('get_messages', {roomId: id})

        socket.on('messages', (data) => {
            setMessages(data)
            console.log(data)
        })

        socket.on('receive_message', (message) => {
            console.log("RECIEVE MESSAGE", message)
            setMessages((state) => [
                ...state, message
            ])
        })

        setLoading(false)

        return () => {
            socket.off('messages');
            socket.off('receive_message');
        }

    }, [socketStore.socket])

    if (loading) return (<div> Loading ... </div>)
    return (
        <div>
            <h2>{id}</h2>
            <Messages messages={messages}></Messages>
            <SendMessage/>
        </div>
    );
};

export default Index;
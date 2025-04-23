import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {useNavigate, useParams} from "react-router-dom";
import Messages from "./messages";
import SendMessage from "./sendMessage";
import styles from './styles.module.css'

const Index = () => {

    const {socketStore} = useContext(Context)
    const {id} = useParams()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()


    useEffect(() => {
        console.log("Render chat page")

        const socket = socketStore.socket
        if (!socket) {
            return
        }

        socket.emit('check_if_user_is_in_chat', {roomId: id, username: localStorage.getItem("username")});
        socket.emit('get_messages', {roomId: id})
        socket.on('messages', (data) => {
            setMessages(data)
        })
        socket.on('no_room_exists', () => {
            console.log('no_room_exists')
            navigate('/')
        })
        socket.on('user_is_not_in_room', () => {
            console.log('user_is_not_in_room')
            navigate('/')
        })
        socket.on('receive_message', (message) => {
            setMessages((state) => [
                ...state, message
            ])
        })

        setLoading(false)

        return () => {
            socket.off('messages');
            socket.off('receive_message');
            socket.off('no_room_exists');
            socket.off('user_is_not_in_room');
        }

    }, [socketStore.socket, navigate, id])

    if (loading) return (<div> Loading ... </div>)
    return (
        <div className={`${styles.page_container}`}>
            <div className={styles.chat_wrapper}>
                <h2 className={`${styles.title}`}>{id}</h2>
                <h3 className={`${styles.subtitle}`}> Dialog started ...</h3>
                <Messages messages={messages}></Messages>
            </div>
            <SendMessage/>
        </div>
    );
};

export default Index;
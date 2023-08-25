import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import styles from './styles.module.css';
import {useNavigate} from "react-router-dom";

const Index = () => {

    const {socketStore, userStore} = useContext(Context)
    const [roomName, setRoomName] = useState('')
    const [userName, setUserName] = useState('')
    const [roomPassword, setRoomPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()


    useEffect(() => {
        if (!socketStore.socket) return
        const socket = socketStore.socket

        socket.on('room_already_exists', (err) => {
            setError(err)
        })

        socket.on('invalid_name_or_password', (err) => {
            setError(err)
        })

        socket.on('room_id', ({roomId}) => {
            navigate(`/chat/${roomId}`)
        })

        socket.on('name_is_taken', (err) => {
            setError(err)
        })
        socket.on('username_is_taken', (err) => {
            setError(err)
        })

        return () => {
            socket.off('room_already_exists');
            socket.off('invalid_name_or_password');
            socket.off('room_id');
            socket.off('name_is_taken');
            socket.off('username_is_taken');
        }


    }, [socketStore.socket])

    function createRoom() {
        const socket = socketStore.socket
        socket.emit('create_room', {room: roomName, password: roomPassword, name: userName})
        userStore.setUser(userName)

    }

    function joinRoom() {
        const socket = socketStore.socket
        socket.emit('join_room', {room: roomName, password: roomPassword, name: userName})
        userStore.setUser(userName)

    }

    return (
        <div>
            {
                (error !== '') && (
                    <h5>{error}</h5>
                )
            }
            <div style={{marginTop: '3rem'}}>
                <input
                    placeholder={"room name"}
                    className={styles.my_input}
                    value={roomName}
                    onChange={(e) => {
                        setRoomName(e.target.value)
                    }}
                />
                <input
                    placeholder={"your name"}
                    className={styles.my_input}
                    value={userName}
                    onChange={(e) => {
                        setUserName(e.target.value)
                    }}
                />
            </div>

            <div>
                <input
                    placeholder={"password"}
                    className={styles.my_input}
                    value={roomPassword}
                    onChange={(e) => {
                        setRoomPassword(e.target.value)
                    }}
                />
            </div>

            <button
                style={{marginTop: '1rem'}}
                className={styles.my_button}
                onClick={createRoom}> Create
            </button>

            <h5> OR </h5>
            <div>
                <div style={{marginTop: '3rem'}}>
                    <input
                        placeholder={"room name"}
                        className={styles.my_input}
                        value={roomName}
                        onChange={(e) => {
                            setRoomName(e.target.value)
                        }}
                    />
                    <input
                        placeholder={"your name"}
                        className={styles.my_input}
                        value={userName}
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                    />
                </div>

                <div>
                    <input
                        placeholder={"password"}
                        className={styles.my_input}
                        value={roomPassword}
                        onChange={(e) => {
                            setRoomPassword(e.target.value)
                        }}
                    />
                </div>

                <button
                    style={{marginTop: '1rem'}}
                    className={styles.my_button}
                    onClick={joinRoom}> Join
                </button>
            </div>
        </div>
    );
};

export default Index;
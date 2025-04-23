import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import styles from './styles.module.css';
import {useNavigate} from "react-router-dom";
import {Card, Table} from "react-bootstrap";
import JoinModal from "./joinModal";

const Index = () => {

    const {socketStore} = useContext(Context)
    const [roomName, setRoomName] = useState('')
    const [userName, setUserName] = useState('')
    const [roomPassword, setRoomPassword] = useState('')
    const [error, setError] = useState('')
    const [isJoinModalVisible, setIsJoinModalVisible] = useState(false)
    const [rooms, setRooms] = useState([])
    const [registered, setRegistered] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        console.log("Render home page")
        const socket = socketStore.socket
        if (!socket) return
        if (localStorage.getItem("room")) {
            socket.emit('leave_room', {
                roomName: localStorage.getItem("room"),
                username: localStorage.getItem("username")
            });
            localStorage.removeItem("room")
        }

        if (localStorage.getItem("username")) setRegistered(true)

        socket.emit('get_rooms')

        socket.on('room_already_exists', (err) => {
            setError(err)
        })

        socket.on('invalid_name_or_password', (err) => {
            setError(err)
            console.log("invalid data")
        })

        socket.on('room_created', ({roomId}) => {
            console.log('navigate', roomId)
            navigate(`/chat/${roomId}`)
        })

        socket.on('room_joined', ({roomId}) => {
            console.log('navigate', roomId)
            navigate(`/chat/${roomId}`)
        })

        socket.on('username_is_taken', (err) => {
            setError(err)
        })

        socket.on('registered', () => {
            setRegistered(true)
        })

        socket.on('rooms', (rooms) => {
            setRooms(rooms)
        })

        socket.on('delete_room', ({roomId}) => {
            console.log("delete room", roomId)
            let updatedRooms = rooms.filter(room => room.name !== roomId)
            setRooms(updatedRooms)
        })

        return () => {
            socket.off('room_already_exists');
            socket.off('invalid_name_or_password');
            socket.off('room_created');
            socket.off('username_is_taken');
            socket.off('registered');
            socket.off('rooms');
        }

    }, [socketStore.socket])

    function createRoom() {
        if (roomName.trim() !== '') {
            const socket = socketStore.socket
            socket.emit('create_room', {
                roomName: roomName,
                password: roomPassword,
                creatorName: localStorage.getItem("username")
            })
            localStorage.setItem("room", roomName)
        } else alert("Can't create room with empty name")
    }

    function joinRoom(password) {
        if (password.trim() !== '') {
            const socket = socketStore.socket
            console.log("Emit join room")
            socket.emit('join_room', {
                roomName: roomName,
                password: password,
                username: localStorage.getItem("username")
            })
            localStorage.setItem("room", roomName)
        } else alert("Password can't be empty")
    }

    function register() {
        setUserName(userName.trim())
        if (userName.trim().length >= 3) {
            socketStore.socket.emit("register", {username: userName})
            localStorage.setItem("username", userName)
        } else alert("Nickname should be longer than 3 symbols")
    }

    return (
        <div className={styles.page_container}>
            {
                registered ?
                    (
                        <div>
                            <div className={styles.create_room_card_container}>
                                <Card className={styles.create_room_card}>
                                    <h2 className={styles.create_room_card_header}>Create room</h2>
                                    {
                                        (error !== '') && (
                                            <h5>{error}</h5>
                                        )
                                    }
                                    <div>
                                        <input
                                            placeholder={"name"}
                                            className={styles.create_room_input}
                                            value={roomName}
                                            onChange={(e) => {
                                                setRoomName(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder={"password"}
                                            className={styles.create_room_input}
                                            value={roomPassword}
                                            onChange={(e) => {
                                                setRoomPassword(e.target.value)
                                            }}
                                        />
                                    </div>

                                    <button
                                        className={`my_button ${styles.create_room_button}`}
                                        onClick={createRoom}> Create
                                    </button>
                                </Card>
                            </div>
                            <h2 className={styles.rooms_header}> Rooms </h2>
                            <div>
                                <Table striped="columns">
                                    <thead>
                                    <tr key={"head"}>
                                        <th>Room name</th>
                                        <th>Participants</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        rooms.map(room =>
                                            <tr
                                                key={room.name}
                                                onClick={() => {
                                                    setRoomName(room.name)
                                                    setIsJoinModalVisible(true)
                                                }}>
                                                <td>{room.name}</td>
                                                <td>{room.participants}</td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </Table>
                                <JoinModal
                                    roomName={roomName}
                                    show={isJoinModalVisible}
                                    onHide={() => setIsJoinModalVisible(false)}
                                    onSuccess={joinRoom}
                                > </JoinModal>
                            </div>
                        </div>
                    )
                    :
                    <div>
                        <div className={styles.register_card_container}>
                            <Card className={styles.register_card}>
                                <h4> Registration </h4>
                                {
                                    error &&
                                    <Card className={styles.error_card}>
                                        <Card.Text> {error} : {userName} </Card.Text>
                                    </Card>
                                }
                                <div className={styles.name_row}>
                                    <label>Nickname</label>
                                    <input
                                        placeholder={"Name"}
                                        className={"my_input"}
                                        value={userName}
                                        onChange={(e) => {
                                            setUserName(e.target.value)
                                            setError('')
                                        }}
                                    />
                                </div>
                                <button
                                    className={`my_button_small ${styles.reg_button}`}
                                    onClick={register}
                                >
                                    Sign up
                                </button>
                            </Card>
                        </div>
                    </div>
            }
        </div>
    )
}
export default Index;
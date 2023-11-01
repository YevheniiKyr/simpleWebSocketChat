import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import styles from './styles.module.css';
import {useNavigate} from "react-router-dom";
import {Card, Table} from "react-bootstrap";
import JoinModal from "./joinModal";

const Index = () => {

    const {socketStore, userStore} = useContext(Context)
    const [roomName, setRoomName] = useState('')
    const [userName, setUserName] = useState('')
    const [roomPassword, setRoomPassword] = useState('')
    const [error, setError] = useState('')
    const [isJoinModalVisible, setIsJoinModalVisible] = useState(false)
    const [rooms, setRooms] = useState([])
    const [registered, setRegistered] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        if (!socketStore.socket) return
        const socket = socketStore.socket

        if(userStore.user) setRegistered(true)
        socket.emit('get_rooms')

        socket.on('room_already_exists', (err) => {
            setError(err)
        })

        socket.on('invalid_name_or_password', (err) => {
            setError(err)
        })

        socket.on('room_id', ({roomId}) => {
            navigate(`/chat/${roomId}`)
        })

        socket.on('registered', () => {
            setRegistered(true)
        })

        socket.on('name_is_taken', (err) => {
            setError(err)
        })

        socket.on('username_is_taken', (err) => {
            setError(err)
        })

        socket.on('rooms', (rooms) => {
            setRooms(rooms)
        })

        return () => {
            socket.off('room_already_exists');
            socket.off('invalid_name_or_password');
            socket.off('room_id');
            socket.off('name_is_taken');
            socket.off('username_is_taken');
        }

    }, [socketStore.socket, rooms])

    function createRoom() {
        if (roomName.trim() !== '') {
            const socket = socketStore.socket
            socket.emit('create_room', {room: roomName, password: roomPassword, name: userName})
            setRooms([...rooms, {room: roomName, password: roomPassword, name: userName}])
            userStore.setUser(userName)
        } else alert("Can't create room with empty name")
    }

    function joinRoom(password) {
        if (password.trim() !== '') {
            const socket = socketStore.socket
            socket.emit('join_room', {room: roomName, password: password, name: userName})
            userStore.setUser(userName)
        } else alert("Password can't be empty")

    }

    function register() {
        setUserName(userName.trim())
        if (userName.trim().length >= 3) {
            console.log("emit register " + userName)
            socketStore.socket.emit("register", {userName})
            localStorage.setItem("username", userName)
        } else alert("Nickname should be longer than 3 symbols")
    }

    function getRooms() {
        const socket = socketStore.socket
        socket.emit('get_rooms')
    }


    return (
        <div className={styles.page_container}>
            {
                registered ?
                    (
                        <div>
                            <div className={styles.create_room_card_container}>
                                <Card className={styles.create_room_card}>
                                    <h2 style={{textAlign: "center", padding: '0.5rem'}}>Create room</h2>
                                    {
                                        (error !== '') && (
                                            <h5>{error}</h5>
                                        )
                                    }
                                    <div>
                                        <input
                                            placeholder={"room name"}
                                            style={{marginBottom: '0.5rem'}}
                                            className={styles.create_room_input}
                                            value={roomName}
                                            onChange={(e) => {
                                                setRoomName(e.target.value)
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <input
                                            placeholder={"password"}
                                            className={styles.create_room_input}
                                            value={roomPassword}
                                            onChange={(e) => {
                                                setRoomPassword(e.target.value)
                                            }}
                                        />
                                    </div>

                                    <button
                                        style={{margin: '1rem auto'}}
                                        className={"my_button"}
                                        onClick={createRoom}> Create
                                    </button>
                                </Card>
                            </div>
                            <h5> Rooms </h5>

                            <div>
                                <Table striped="columns">
                                    <thead>
                                    <tr>
                                        <th>Room name</th>
                                        <th>Participants</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        rooms.map(room =>
                                            <tr
                                                key={room.room}
                                                onClick={() => {
                                                    setRoomName(room.room)
                                                    setIsJoinModalVisible(true)
                                                }}>
                                                <td>{room.room}</td>
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
                                <h4 style={{textAlign: "center"}}> Registration </h4>
                                {
                                    error &&
                                    <Card className={styles.error_card}>
                                        <Card.Text> {error} : {userName} </Card.Text>
                                    </Card>
                                }

                                <div>
                                    <label className={'me-2'}>nickname : </label>
                                    <input
                                        placeholder={"name"}
                                        className={"my_input"}
                                        value={userName}
                                        onChange={(e) => {
                                            setUserName(e.target.value)
                                            setError('')
                                        }}
                                    />
                                </div>
                                <button
                                    className={"my_button_small"}
                                    style={{margin: "0.5rem auto"}}
                                    onClick={register}> Register
                                </button>
                            </Card>

                        </div>
                    </div>
            }
        </div>
    )
}
export default Index;
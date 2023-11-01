import React, {useContext, useState} from 'react';
import {Context} from "../../index";
import {useParams} from "react-router-dom";
import styles from './styles.module.css'

const SendMessage = () => {
    const {socketStore, userStore} = useContext(Context)
    const {id} = useParams()
    const [text, setText] = useState('')

    function send() {
        const socket = socketStore.socket
        const user = userStore.user
        const message = {
            id: Date.now(),
            user: user,
            text: text,
            roomId: id
        }
        console.log(message)
        console.log(socket)

        socket.emit('message', message)
    }

    return (
        <div className={`${styles.send_message_container}`}>
                <textarea
                    className={styles.message_input}
                    placeholder="write text here"
                    value={text}
                    rows={2}

                    onChange={(e) => {
                        setText(e.target.value)
                    }}

                />
            <br></br>
            <button onClick={send} className={"my_button"}> Send</button>
        </div>
    );
};

export default SendMessage;
import React, {useContext, useState} from 'react';
import {Context} from "../../index";
import {useParams} from "react-router-dom";
import styles from '../home/styles.module.css'

const SendMessage = () => {
    const {socketStore, userStore} = useContext(Context)
    const {id} = useParams()
    const [text, setText] = useState('')

    function send() {
        const socket = socketStore.socket
        const user = userStore.user
        console.log("USER", user)
        socket.emit('message', {
            id: Date.now(), user: user, text: text, roomId: id
        })

    }

    return (<div style={{display: "block", marginTop: '1rem'}}>
                <textarea
                    placeholder="write text here"
                    value={text}
                    rows={5}
                    style={{borderRadius: '10px', padding: '0.5rem', width: '60%'}}
                    onChange={(e) => {
                        setText(e.target.value)
                    }}

                />
        <br></br>
        <button onClick={send} className={styles.my_button}> Send</button>
    </div>);
};

export default SendMessage;
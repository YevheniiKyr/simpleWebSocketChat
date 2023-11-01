import React, {useContext, useEffect} from 'react';
import {Card} from "react-bootstrap";
import {Context} from "../../index";
import styles from './styles.module.css'

const MessageItem = ({message}) => {
    const {userStore} = useContext(Context)

    return (
        <div
            className={message.user === userStore.user ? `${styles.author_message_container}` : `${styles.not_author_message_container}`}>
            <Card className={styles.message}>
                {
                    message.user !== userStore.user &&
                    <Card.Title style={{display: 'flex', margin: 'auto 0', color: 'rgb(57,152,32)'}}>
                        {message.user}
                    </Card.Title>
                }
                <Card.Text>
                    {message.text}
                </Card.Text>

            </Card>
        </div>
    );
};

export default MessageItem;
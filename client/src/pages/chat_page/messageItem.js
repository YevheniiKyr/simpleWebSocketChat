import React, {useContext, useEffect} from 'react';
import {Card} from "react-bootstrap";
import {Context} from "../../index";

const MessageItem = ({message}) => {
    const {userStore} = useContext(Context)

    return (
        <div style={{
            display: 'flex',
            justifyContent: message.user === userStore.user ? 'end' : "start",
            margin: '2rem'
        }}>
            <Card style={{width: '20%', display: 'flex', alignItems: 'start', padding: '1rem'}}>
                <Card.Title>
                    {message.user}
                </Card.Title>

                <Card.Text>
                    {message.text}
                </Card.Text>
               
            </Card>
        </div>
    );
};

export default MessageItem;
import React, {useEffect, useState} from 'react';
import styles from './styles.module.css'

const MessageItem = ({message}) => {
    const username = localStorage.getItem('username');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        message.text = breakLongWords(message.text);
        setLoading(false)
    }, [message]);

    const breakLongWords = (message) => {
        let words = message.split(' ');
        let newMessage = '';
        for (let word of words) {
            let newWords = breakWord(word)
            newMessage += `${newWords} `;
        }
        return newMessage.slice(0, -1);
    }

    const breakWord = (word) => {
        const maxWordLength = 15;
        if (word.length > 15) {
            return `${word.substring(0, maxWordLength)} ${breakWord(word.substring(maxWordLength))} `
        }
        return word
    }

    return (
        loading ?
            <div> Loading... </div>
            :
            <div
                className={message.user === username ? `${styles.author_message_container}` : `${styles.not_author_message_container}`}>
                {
                    message.user !== username &&
                    <h3 className={styles.username}>
                        {message.user}
                    </h3>
                }
                <div className={styles.message}>
                    <div className={styles.message_text_wrapper}>
                        <p className={styles.message_text}>
                            {message.text}
                        </p>
                    </div>
                </div>
            </div>
    );
};

export default MessageItem;
import React, {useState} from 'react';
import {Button, Form, FormText} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import styles from './styles.module.css'
import generalStyles from '../../global-styles.css'
const JoinModal = ({roomName, show, onHide, onSuccess}) => {

    const [password, setPassword] = useState('')

    return (
        <div
            className={styles.join_room_modal}
        >
            <Modal show={show} onHide={onHide} centered>

                <Modal.Header closeButton>
                </Modal.Header>

                <Modal.Title
                className = "center"> {`Join "${roomName}" room`}</Modal.Title>

                <Form.Control
                    id = "input_password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={styles.input_password}
                    placeholder="Input password"
                />
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => onSuccess(password)}> Enter</Button>
                    <Button variant="secondary">Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default JoinModal;
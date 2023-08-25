import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/home";
import io from 'socket.io-client';
import {useContext, useEffect} from "react";
import {Context} from "./index";
import Chat from "./pages/chat_page";


function App() {

    const {socketStore} = useContext(Context)

    useEffect(() => {
        const socket = io.connect('http://localhost:5000');
        socketStore.setSocket(socket)
    }, [])

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route
                        path='/'
                        element={<Home/>}>
                    </Route>
                    <Route
                        path={'chat/:id'}
                        element={<Chat/>}>
                    </Route>
                </Routes>
            </Router>


        </div>
    );
}

export default App;

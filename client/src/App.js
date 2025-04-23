import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from "./pages/home";
import io from 'socket.io-client';
import {useContext, useEffect} from "react";
import {Context} from "./index";
import Chat from "./pages/chat_page";


function App() {

    const {socketStore} = useContext(Context)

    useEffect(() => {
        const socket = io.connect('https://simplewebsocketchat.onrender.com', {'multiplex': false});
        socketStore.setSocket(socket)
    }, [socketStore])


    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route
                        key='/'
                        path='/'
                        element={<Home/>}
                    >
                    </Route>
                    {
                        <Route
                            key={'/chat/id'}
                            path={'/chat/:id'}
                            element={<Chat/>}>
                        </Route>
                    }
                    <Route
                        key = '*'
                        path='*'
                        element={<Navigate to='/' replace/>}
                    >
                    </Route>
                </Routes>
            </Router>


        </div>
    )
        ;
}

export default App;

import "./App.css"
import io from "socket.io-client"
import Qs from "qs"
import { useEffect, useRef, useState } from 'react'
import { useLocation } from "react-router-dom"

function Chat() {
    
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const textMessage = useRef(null)
    const location = useLocation()
    
    const { username, room } = Qs.parse(location.search, {
        ignoreQueryPrefix: true
    })
    
    let socket = undefined
    useEffect(() => {
    socket = io("http://localhost:5000")

        socket.emit('joinRoom', { username, room })

        socket.on('roomUsers', ({ users }) => {
            setUsers(users)
        })

        socket.on('message', message => {
            setMessages(prevMessages => [...prevMessages, message])
        })

    },[])
        const handleSubmit = e => {
            e.preventDefault()
            const msg = textMessage.value

            socket.emit('chatMessage', msg)

            textMessage.value = ''
            textMessage.focus()
        }

    return (<div className="chat-container">
        <header className="chat-header">
            <h1><i className="fas fa-smile"></i> ChatCord</h1>
            <a href="index.html" className="btn">Leave Room</a>
        </header>
        <main className="chat-main">
            <div className="chat-sidebar">
                <h3><i className="fas fa-comments"></i> Room Name:</h3>
                <h2 id="room-name">{room}</h2>
                <h3><i className="fas fa-users"></i> Users</h3>
                <ul id="users">
                    {users.map(user => <li>{user.username}</li>)}
                </ul>
            </div>
            <div className="chat-messages">
                {messages.map(message =>
                    <div className="message">
                        <p className="meta">{message.username} <span>{message.time}</span></p>
                        <p className="text">
                            {message.text}
                        </p>
                    </div>)}
            </div>
        </main>
        <div className="chat-form-container">
            <form id="chat-form" onSubmit={handleSubmit}>
                <input
                    ref={textMessage}
                    id="msg"
                    type="text"
                    placeholder="Enter Message"
                    required
                    autoComplete="off"
                />
                <button className="btn"><i className="fas fa-paper-plane"></i> Send</button>
            </form>
        </div>
    </div>);
}

export default Chat;
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket.js";

export default function Chat() {
    const chatMessages = useSelector((store) => store.chatMessages);
    const chatContainer = useRef();
    const chatMessenger = useRef();

    useEffect(() => {
        console.log("OH LOOK A NEW CHAT MESSAGE, lets scroll to the bottom...");

        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }, [chatMessages]);

    return (
        <div className="chat">
            <div className="chat-container" ref={chatContainer}>
                {chatMessages.map((message) => (
                    <div key={message.created_at} className="chat-message">
                        <img className="chatImage" src={message.image} />
                        <div>
                            <p className="chatInfo">
                                <b>
                                    {message.firstname}&nbsp;
                                    {message.lastname}
                                </b>
                                &nbsp;&nbsp;&nbsp;
                                {new Date(
                                    message.created_at
                                ).toLocaleTimeString()}
                                ,&nbsp;&nbsp;
                                {new Date(
                                    message.created_at
                                ).toLocaleDateString()}
                            </p>
                            <p className="chatText">{message.message}</p>
                        </div>
                    </div>
                ))}
            </div>
            <textarea
                defaultValue="Write your message..."
                id="chatInput"
                ref={chatMessenger}
            />
            <button
                className="coinBtn"
                onClick={() => {
                    console.log(chatMessenger.current.value);
                    socket.emit("chatMessage", chatMessenger.current.value);
                }}
            >
                Send
            </button>
        </div>
    );
}

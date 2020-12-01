/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable space-before-function-paren */
/* eslint-disable space-before-blocks */
/* eslint-disable semi */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { selectUser } from '../store/slices/userSlice';

function ChatWindow(props) {
  const user = useSelector(selectUser);
  const [messages, setMessages] = useState(['']);
  const [value, setValue] = useState('');

  const socket = io();
  socket.on('connect', function(){
    console.log('Welcome to Chat!')
  });

  socket.on('disconnect', function(){
    console.log('lkeft')
  });

  socket.on('getMessages', function(data){
    setMessages(data);
  });

  function changeValue(event) {
    setValue(event.target.value)
  }

  function handleSend() {
    socket.on('newMessage', value);
    setValue('');
  }

  return (
    <div>
      <h1>Test</h1>
      <div>
        {messages.map((m) => (
          <p key={m}>m</p>
        ))}
      </div>
      <input type="text" onChange={changeValue} value={value} />
      <button type="button" onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatWindow;

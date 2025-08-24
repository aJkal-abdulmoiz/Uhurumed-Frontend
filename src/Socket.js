import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (token) => {
  socket = io('http://3.108.43.200:4001', {
  // socket = io("wss://192.168.1.9:5000, {
    auth: { token: 'Bearer ' + token },
  });

  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
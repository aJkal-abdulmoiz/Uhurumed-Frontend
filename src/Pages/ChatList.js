import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Skeleton,
  useMediaQuery,
  Drawer,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { SlNote } from 'react-icons/sl';
import NotePad from '../CommonComponenet/CommonButtons/NotePad';
import axios from 'axios';
import ApiConfig from '../ApiConfig/ApiConfig';
import { MdDone } from 'react-icons/md';
import { IoMdDoneAll } from 'react-icons/io';
import MessageIcon from '@mui/icons-material/Message';
import ClearIcon from '@mui/icons-material/Clear';

import moment from 'moment';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  initializeSocket,
} from '../Socket';
import { AuthContext } from '../Context/Auth';
import toast from 'react-hot-toast';
import Btn from '../CommonComponenet/CommonButtons/Btn';

const ChatLayout = () => {
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const auth = useContext(AuthContext);
  const userData = auth?.userData;
  const sendingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState({ messages: [] });
  const [selectedUser, setSelectedUser] = useState(null);
  const [storeImage, setStoreImage] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // const filteredUsers = useMemo(() => {
  //   if (!searchTerm) return chatList;
  //   return chatList?.filter((user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [users, searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return chatList;

    return chatList?.filter((user) =>
      user.otherParticipant?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [chatList, searchTerm]);

  const getAllUserChating = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);

    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.RoomChat,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('asfdadfds', response?.data?.success);
      if (response?.data?.error === 'false') {
        setLoading(false);
        const data = response?.data?.data;

        console.log('5445554546', response);
        setChatList(data);
        // if (data && data?.length > 0) {
        //   const firstUser = data?.[0];
        //   setSelectedUser(firstUser);
        //   messagesRoomHandler(firstUser?.id);
        //   setLoading(false);
        // }
        setLoading(false);

        // setTotalPages(response?.data?.data?.[0]?.count);
      }
    } catch (error) {
      setChatList([]);
      setLoading(false);

      console.log('errorerror', error);

      return error?.response;
    }
  };

  const uploadDataHandler = async (image) => {
    if (!image) return;
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true); // Show loader

    const formData = new FormData();
    formData.append('files', image);

    try {
      const response = await axios.post(ApiConfig.uploadFile, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.error === 'false') {
        const imageUrl = response?.data?.data?.secureUrl;
        setStoreImage(imageUrl);
        await ImagesendMessageHandler(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false); // Hide loader
    }
  };
  const messagesRoomHandler = async (id) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoadingMessages(true);
    try {
      const response = await axios({
        method: 'GET',
        url: `${ApiConfig.messagesRoom}/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          limit: 100,
        },
      });
      console.log('asfdadfds', response?.data?.success);
      if (response?.data?.error === 'false') {
        setLoadingMessages(false);
        console.log('56465464545', response?.data?.data);
        setMessages(response?.data?.data);
        // setTotalPages(response?.data?.data?.[0]?.count);
      } else {
        setLoadingMessages(false);
      }
    } catch (error) {
      setMessages([]);
      setLoadingMessages(false);

      console.log('errorerror', error);

      return error?.response;
    }
  };

  useEffect(() => {
    const setupSocket = async () => {
      const token = window.localStorage.getItem('UhuruMedToken');
      const storedData = JSON.parse(localStorage.getItem('userData'));

      console.log('🔑 Retrieved Token:', token);
      const currentData = userData;
      if (!token) {
        console.error('❌ No auth token found, cannot connect WebSocket.');

        return;
      }

      const initializedSocket = await initializeSocket(token);
      setSocket(initializedSocket);
      connectSocket();

      if (initializedSocket) {
        initializedSocket.on('connect', () => {
          console.log(
            '✅ Connected to WebSocket server:',
            initializedSocket.id
          );
        });

        initializedSocket.on('disconnect', (reason) => {
          console.log('❌ Disconnected:', reason);
        });

        initializedSocket.on('connect_error', (error) => {
          console.error('⚠️ Connection Error:', error);
        });
        console.log('adfasdgfs', currentData);

        // 🔄 Handle incoming messages
        // initializedSocket.on("newMessage", ({ roomId, message }) => {
        //   console.log(`💬 New message in room ${roomId}:`, message);

        //   // Only add message to UI if it matches the currently selected user or room
        //   // if (message.id === selectedUser?.id || roomId === selectedUser?.roomId) {
        //   setMessages((prev) => ({
        //     ...prev,
        //     messages: [...(prev?.messages || []), message],
        //   }));
        //   //  }
        // });

        // initializedSocket.on("newMessage", ({ roomId, message }) => {
        //   setMessages((prev) => ({
        //     ...prev,
        //     messages: [
        //       ...(prev?.messages || []),
        //       {
        //         ...message,
        //         isMine: message.senderId === userData?.id,
        //       },
        //     ],
        //   }));
        // });

        initializedSocket.on('newMessage', ({ roomId, message }) => {
          console.log(`💬 New message in room ${roomId}:`, message);

          setMessages((prev) => {
            const alreadyExists = prev.messages.some(
              (msg) =>
                msg.createdAt === message.createdAt &&
                msg.content === message.content
            );

            if (alreadyExists) return prev;

            return {
              ...prev,
              messages: [...(prev?.messages || []), message],
            };
          });
        });
      }
    };

    setupSocket();

    return () => {
      disconnectSocket(); // cleanup
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
  }, [messages.messages?.length]);

  const sendMessageHandler = () => {
    if (sendingRef.current || !input.trim()) return;

    sendingRef.current = true;

    const newMessage = {
      roomId: selectedUser?.id,
      content: input,
      messageType: 'TEXT',
      createdAt: new Date().toISOString(),
    };
    socket?.emit('sendMessage', newMessage);
    setInput('');
    setTimeout(() => {
      sendingRef.current = false;
    }, 300); // delay to avoid spamming
  };

  const ImagesendMessageHandler = (imageUrl) => {
    if (sendingRef.current || !imageUrl) return;

    sendingRef.current = true;
    const newMessage = {
      roomId: selectedUser?.id,
      attachmentUrl: imageUrl,
      content: 'Image',
      messageType: 'ATTACHMENT',
      createdAt: new Date().toISOString(),
    };
    socket?.emit('sendMessage', newMessage);
    setInput('');
    setTimeout(() => {
      sendingRef.current = false;
    }, 300); // delay to avoid spamming
  };

  useEffect(() => {
    getAllUserChating();
  }, []);
  const SidebarContent = (
    <Box
      sx={{
        width: 320,
        overflow: 'scroll',
        borderRight: '1px solid #e0e0e0',
        p: 2,
        bgcolor: '#fafafa',
        borderRadius: 2,
        height: '100%',
        marginTop: { xs: '70px', sm: '0px' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
          style={{ color: '#0077CC' }}
        >
          Messages
        </Typography>
        <IconButton
          onClick={() => setOpenDrawer(false)}
          color="#000"
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        >
          <ClearIcon />
        </IconButton>
      </Box>
      <TextField
        placeholder="Search..."
        variant="outlined"
        fullWidth
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, fontSize: '10px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <List>
        {loading ? (
          Array.from(new Array(5)).map((_, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={20}
                      style={{ marginBottom: 6 }}
                    />
                  }
                  secondary={
                    <Box>
                      <Skeleton variant="text" width="80%" height={16} />
                      <Skeleton variant="text" width="40%" height={16} />
                    </Box>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        ) : filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <React.Fragment key={user.id}>
              <ListItem
                button
                alignItems="flex-start"
                onClick={() => {
                  setMessages({ messages: [] });
                  setSelectedUser(user);
                  getAllUserChating();
                  messagesRoomHandler(user?.id);
                  if (isSmallScreen) setOpenDrawer(false);
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={
                      user?.otherParticipant?.profilePic ??
                      'https://i.pravatar.cc/150?img=12'
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      fontWeight={600}
                      variant="body1"
                      style={{ fontSize: '14px', color: '#0077CC' }}
                    >
                      {user?.otherParticipant?.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        style={{ fontSize: '12px' }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {user.lastMessage?.content}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ fontSize: '12px' }}
                        color="text.secondary"
                      >
                        {moment(user?.lastMessageAt).fromNow()}
                      </Typography>
                    </Box>
                  }
                />
                {user?.unreadCount === 0 ? null : (
                  <Box
                    sx={{
                      backgroundColor: '#44d444dc',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      style={{ color: '#fff', fontWeight: '500' }}
                    >
                      {user?.unreadCount}
                    </Typography>
                  </Box>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        ) : (
          <Typography
            style={{ color: '#000', fontSize: '17px', textAlign: 'center' }}
          >
            No user found.
          </Typography>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', height: '90vh' }}>
        {/* Left Sidebar */}
        <>
          {isSmallScreen ? (
            <>
              <Box
                sx={{
                  position: 'absolute', // Make sure parent allows this
                  top: 100, // Adjust spacing from top
                  left: 20, // Adjust spacing from left
                  // Ensure it's above content (higher than Drawer default)
                }}
              >
                <IconButton onClick={() => setOpenDrawer(true)} color="#000">
                  <MessageIcon />
                </IconButton>
              </Box>

              <Drawer
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
              >
                {SidebarContent}
              </Drawer>
            </>
          ) : (
            SidebarContent
          )}
        </>

        {/* Right Chat Panel */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            marginLeft: { xs: '40px', md: '0px' },
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#fff',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={
                  selectedUser?.otherParticipant?.profilePic ??
                  '/Images/doctor.png'
                }
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography fontWeight="bold" style={{ color: '#0077CC' }}>
                  {selectedUser?.otherParticipant?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser?.otherParticipant?.userType}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{
                    color: selectedUser?.otherParticipant?.isOnline
                      ? 'green'
                      : 'orange',
                  }}
                >
                  {selectedUser?.otherParticipant?.isOnline
                    ? 'Online'
                    : 'Offline'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              bgcolor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {loadingMessages ? (
              // Show 6 skeleton bubbles
              Array.from(new Array(6)).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
                    mb: 1,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="40%"
                    height={60}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: '#e0e0e0',
                    }}
                  />
                </Box>
              ))
            ) : messages?.messages?.length > 0 ? (
              messages.messages.map((msg, index) => {
                const isMine = msg?.isMine || msg?.sender?.id === userData?.id;

                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        maxWidth: '60%',
                        bgcolor: isMine ? '#DCF8C6' : '#fff',
                        borderRadius: '10px',
                        borderTopRightRadius: isMine ? '0' : '10px',
                        borderTopLeftRadius: isMine ? '10px' : '0',
                      }}
                    >
                      {msg?.messageType === 'ATTACHMENT' ? (
                        <a
                          href={msg?.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-block' }}
                        >
                          <Box
                            component="img"
                            src={
                              msg?.attachmentUrl?.toLowerCase().endsWith('.pdf')
                                ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png' // Default PDF thumbnail
                                : msg?.attachmentUrl ??
                                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJlks1ylqkT3dB4gIp_uVe6a-OfgOgH6RFFg&s'
                            }
                            alt="attachment"
                            sx={{
                              width: '100%',
                              maxHeight: 250,
                              borderRadius: 2,
                              objectFit: 'cover',
                            }}
                          />
                        </a>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                          }}
                        >
                          {msg?.content}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          align="right"
                          sx={{ display: 'block', mt: 0.5 }}
                        >
                          {moment(msg?.createdAt).format('hh:mm A')}
                        </Typography>
                        {/* {isMine && (
                          <Box sx={{ paddingLeft: "4px" }}>
                            {msg?.isRead === "true" ? (
                              <IoMdDoneAll color="blue" size={15} />
                            ) : (
                              <MdDone size={15} />
                            )}
                          </Box>
                        )} */}
                      </Box>
                    </Paper>
                  </Box>
                );
              })
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                textAlign="center"
                py={5}
              >
                <img
                  src="/Images/404.png" // <-- Replace with your image path
                  alt="No results"
                  style={{ maxWidth: 250, marginBottom: 16 }}
                />
                <Typography variant="h5" style={{fontSize:'16px'}}  color="#555">
                  {'You have no messages yet.'}
                </Typography>
               
              </Box>

            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}
            >
              {loading && <CircularProgress size={24} />}
            </Box>
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#fff',
              width: {
                xs: '100%', // full width on small devices
                sm: 'auto', // default or auto width on medium and up
              },
            }}
          >
            <div>
              <IconButton
                onClick={() => document.getElementById('fileUpload').click()}
              >
                <AttachFileIcon />
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      uploadDataHandler(e.target.files[0]);
                    }
                  }}
                />
              </IconButton>
            </div>

            {/* <IconButton onClick={handleOpen}>
              <SlNote />
            </IconButton> */}
            <TextField
              variant="outlined"
              placeholder="Enter a new message"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessageHandler();
              }}
              sx={{
                mx: 1,
                width: '100%',
                height: 48,
                '& .MuiOutlinedInput-root': {
                  height: 48, // set input height
                  fontSize: '14px', // text font size
                  color: '#333', // input text color
                  bgcolor: '#fff', // background color
                  borderRadius: 2,
                  paddingX: 1,
                  '& fieldset': {
                    borderColor: '#ccc', // border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#999',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0077CC', // focus border color
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#999', // placeholder color
                  //   fontStyle: 'italic',
                },
              }}
              InputProps={{
                style: {
                  fontFamily: 'Arial',
                },
              }}
            />
            <IconButton
              onClick={sendMessageHandler}
              disabled={sendingRef.current || !input.trim()}
              sx={{
                bgcolor: '#14B8A6',
                color: '#fff',
                ':hover': { bgcolor: '#14B8A6' },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {open && <NotePad open={open} onClose={handleClose} />}
    </>
  );
};

export default ChatLayout;

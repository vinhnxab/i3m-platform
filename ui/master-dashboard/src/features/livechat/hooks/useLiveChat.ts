import { useState, useRef, useEffect } from 'react';
import { mockChatRooms, mockMessages, mockOnlineAgents } from '../../../../mock-data/livechat';

export const useLiveChat = () => {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatRooms = mockChatRooms;
  const messages = mockMessages;
  const onlineAgents = mockOnlineAgents;

  const currentRoom = chatRooms.find(room => room.id === selectedRoom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectRoom = (room: any) => {
    setSelectedRoom(room.id);
  };

  const handleSearch = () => {
    console.log('Search chat rooms');
  };

  const handleFilter = () => {
    console.log('Filter chat rooms');
  };

  const handleSettings = () => {
    console.log('Open settings');
  };

  const handleViewAgents = () => {
    console.log('View agents');
  };

  const handleCall = () => {
    console.log('Start voice call');
  };

  const handleVideoCall = () => {
    console.log('Start video call');
  };

  const handleMore = () => {
    console.log('More options');
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleMinimize = () => {
    setIsExpanded(false);
  };

  const handleSendFile = (file: File) => {
    console.log('Send file:', file.name);
  };

  const handleSendImage = (file: File) => {
    console.log('Send image:', file.name);
  };

  const handleStartVoice = () => {
    console.log('Start voice recording');
  };

  const handleCallAgent = (agent: any) => {
    console.log('Call agent:', agent.name);
  };

  const handleVideoCallAgent = (agent: any) => {
    console.log('Video call agent:', agent.name);
  };

  const handleMessageAgent = (agent: any) => {
    console.log('Message agent:', agent.name);
  };

  return {
    chatRooms,
    messages,
    onlineAgents,
    currentRoom,
    selectedRoom,
    message,
    isTyping,
    searchQuery,
    isExpanded,
    soundEnabled,
    messagesEndRef,
    setMessage,
    setIsTyping,
    setSearchQuery,
    setIsExpanded,
    setSoundEnabled,
    handleSendMessage,
    handleKeyPress,
    handleSelectRoom,
    handleSearch,
    handleFilter,
    handleSettings,
    handleViewAgents,
    handleCall,
    handleVideoCall,
    handleMore,
    handleExpand,
    handleMinimize,
    handleSendFile,
    handleSendImage,
    handleStartVoice,
    handleCallAgent,
    handleVideoCallAgent,
    handleMessageAgent
  };
};

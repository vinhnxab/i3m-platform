import { useLiveChat } from '@/features/livechat/hooks/useLiveChat';
import {
  LiveChatHeader,
  ChatRoomsList,
  ChatWindow,
  MessageInput,
  OnlineAgents,
  ChatRoomHeader
} from '@/features/livechat';

export function LiveChat() {
  const {
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
  } = useLiveChat();

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6">
      <div className={`flex h-screen bg-background ${isExpanded ? 'fixed inset-0 z-50' : 'h-[800px]'}`}>
        {/* Chat Rooms Sidebar */}
        <ChatRoomsList
          chatRooms={chatRooms}
          selectedRoom={selectedRoom}
          onSelectRoom={handleSelectRoom}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentRoom ? (
            <>
              {/* Chat Room Header */}
              <ChatRoomHeader
                room={currentRoom}
                isExpanded={isExpanded}
                onCall={handleCall}
                onVideoCall={handleVideoCall}
                onExpand={handleExpand}
                onMinimize={handleMinimize}
                onMore={handleMore}
              />

              {/* Chat Window */}
              <ChatWindow
                messages={messages}
                currentRoom={currentRoom}
              />

              {/* Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                onSendFile={handleSendFile}
                onSendImage={handleSendImage}
                onStartVoice={handleStartVoice}
                placeholder="Type a message..."
                disabled={false}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Online Agents Sidebar */}
        <div className="w-80 bg-card border-l border-border">
          <LiveChatHeader
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSettings={handleSettings}
            onViewAgents={handleViewAgents}
          />
          <div className="p-4">
            <OnlineAgents
              agents={onlineAgents}
              onCall={handleCallAgent}
              onVideoCall={handleVideoCallAgent}
              onMessage={handleMessageAgent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

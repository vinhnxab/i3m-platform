import React, { useState } from 'react';
import { Button, Textarea } from '@/shared/components/ui';
import { Send, Paperclip, Smile, Mic, Image, File } from 'lucide-react';

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  onSendFile?: (file: File) => void;
  onSendImage?: (file: File) => void;
  onStartVoice?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendFile,
  onSendImage,
  onStartVoice,
  placeholder = "Type a message...",
  disabled = false
}) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendFile) {
      onSendFile(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendImage) {
      onSendImage(file);
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[40px] max-h-[120px] resize-none"
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={disabled}
          >
            <Image className="w-4 h-4" />
          </Button>
          
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={disabled}
          >
            <File className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onStartVoice}
            disabled={disabled}
          >
            <Mic className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
          >
            <Smile className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || disabled}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Mock LiveChat Messages Data
export interface MockSender {
  id: number;
  name: string;
  role: 'customer' | 'agent' | 'system';
}

export interface MockAttachment {
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface MockMessage {
  id: number;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  sender: MockSender;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: MockAttachment;
}

export const mockMessages: MockMessage[] = [
  {
    id: 1,
    content: 'Hi! I need help with integrating your API into our system. We\'re getting authentication errors.',
    type: 'text',
    sender: {
      id: 1,
      name: 'John Doe',
      role: 'customer'
    },
    timestamp: '2024-01-15 10:35:00',
    status: 'read'
  },
  {
    id: 2,
    content: 'Hello John! I\'d be happy to help you with the API integration. Can you please share the specific error message you\'re encountering?',
    type: 'text',
    sender: {
      id: 1,
      name: 'Sarah Wilson',
      role: 'agent'
    },
    timestamp: '2024-01-15 10:36:00',
    status: 'read'
  },
  {
    id: 3,
    content: 'Here\'s the error log from our application. It seems to be related to the JWT token validation.',
    type: 'file',
    sender: {
      id: 1,
      name: 'John Doe',
      role: 'customer'
    },
    timestamp: '2024-01-15 10:38:00',
    status: 'read',
    attachment: {
      name: 'error-log.txt',
      size: '2.3 KB',
      type: 'text/plain',
      url: '#'
    }
  },
  {
    id: 4,
    content: 'Thank you for sharing the error log. I can see the issue. The JWT token format in your request headers is incorrect. Let me walk you through the correct implementation.',
    type: 'text',
    sender: {
      id: 1,
      name: 'Sarah Wilson',
      role: 'agent'
    },
    timestamp: '2024-01-15 10:40:00',
    status: 'read'
  }
];

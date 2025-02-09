import React from 'react';
import { MessageSquare, Code, Table, Quote, List } from 'lucide-react';
import type { ChatMessage } from '../types/ChatMessage';

const renderContent = (message: ChatMessage) => {
  const { content, type, metadata } = message;

  switch (type) {
    case 'code':
      return (
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className={metadata?.language ? `language-${metadata.language}` : ''}>
            {content}
          </code>
        </pre>
      );

    case 'table':
      const rows = content.split('\n').map(row => row.split('|').filter(cell => cell.trim()));
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {metadata?.tableHeaders && (
              <thead className="bg-gray-50">
                <tr>
                  {metadata.tableHeaders.map((header, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
          {content}
        </blockquote>
      );

    case 'list':
      const items = content.split('\n');
      return metadata?.listType === 'ordered' ? (
        <ol className="list-decimal list-inside">
          {items.map((item, i) => (
            <li key={i} className="mb-2">{item.trim()}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc list-inside">
          {items.map((item, i) => (
            <li key={i} className="mb-2">{item.trim()}</li>
          ))}
        </ul>
      );

    default:
      return <p className="text-gray-700 whitespace-pre-wrap">{content}</p>;
  }
};

const getMessageIcon = (type: ChatMessage['type']) => {
  switch (type) {
    case 'code':
      return <Code className="w-5 h-5 text-blue-500" />;
    case 'table':
      return <Table className="w-5 h-5 text-green-500" />;
    case 'quote':
      return <Quote className="w-5 h-5 text-purple-500" />;
    case 'list':
      return <List className="w-5 h-5 text-orange-500" />;
    default:
      return <MessageSquare className="w-5 h-5 text-gray-500" />;
  }
};

export const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors">
      <img
        src={message.sender.avatar || `https://ui-avatars.com/api/?name=${message.sender.name}`}
        alt={message.sender.name}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-gray-900">{message.sender.name}</span>
          <span className="text-sm text-gray-500">
            {new Date(message.timestamp).toLocaleString()}
          </span>
          {getMessageIcon(message.type)}
        </div>
        <div className="mt-2">{renderContent(message)}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
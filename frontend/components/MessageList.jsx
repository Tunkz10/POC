'use client';

export default function MessageList({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No messages yet. Start a conversation below.
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-600">
              {new Date(message.created_at).toLocaleString()}
            </p>
          </div>
          <p className="text-gray-900">{message.message}</p>
        </div>
      ))}
    </div>
  );
}


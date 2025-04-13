export const mockTelegramApi = {
  getMe: {
    ok: true,
    result: {
      id: 123456789,
      is_bot: true,
      first_name: 'TestBot',
      username: 'test_bot',
    },
  },
  sendMessage: {
    ok: true,
    result: {
      message_id: 1,
      date: Date.now(),
      chat: {
        id: 123456789,
        type: 'private',
      },
      text: 'Test message',
    },
  },
  sendDocument: {
    ok: true,
    result: {
      message_id: 2,
      date: Date.now(),
      chat: {
        id: 123456789,
        type: 'private',
      },
      document: {
        file_id: 'test-file-id',
        file_unique_id: 'test-file-unique-id',
        file_name: 'test.txt',
        file_size: 1024,
      },
    },
  },
}; 
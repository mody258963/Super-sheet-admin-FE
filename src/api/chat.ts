import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import { fetcher, fetcherPost } from 'utils/axios';

// types
import { ChatHistory } from 'types/chat';
import { UserProfile } from 'types/user-profile';

// ==============================|| API - CHAT ||============================== //

const endpoints = {
  key: '/api/chat',  // Updated with leading slash
  list: '/users',    // server URL
  update: '/filter'  // server URL
};

export function useGetUsers() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: true,  // Changed to true to ensure fresh data
    revalidateOnFocus: true,  // Changed to true to refresh on focus
    revalidateOnReconnect: true  // Changed to true to refresh on reconnect
  });

  // Fallback data for development/testing
  const fallbackUsers = [
    {
      id: '1',
      name: 'John Doe',
      avatar: '/assets/images/users/avatar-1.png',
      status: 'online',
      lastMessage: '2 min ago',
      unReadChatCount: 2
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: '/assets/images/users/avatar-2.png',
      status: 'offline',
      lastMessage: '1 hour ago',
      unReadChatCount: 0
    },
    {
      id: '3',
      name: 'Alex Johnson',
      avatar: '/assets/images/users/avatar-3.png',
      status: 'online',
      lastMessage: '5 min ago',
      unReadChatCount: 1
    }
  ];

  const memoizedValue = useMemo(
    () => ({
      users: (data?.users as UserProfile[]) || fallbackUsers,  // Added fallback data
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.users?.length && fallbackUsers.length === 0
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUserChat(userName: string) {
  const URL = [endpoints.key + endpoints.update, { user: userName, endpoints: 'chat' }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherPost, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      chat: (data as ChatHistory[]) || [],
      chatLoading: isLoading,
      chatError: error,
      chatValidating: isValidating,
      chatEmpty: !isLoading && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function insertChat(userName: string, newChat: ChatHistory) {
  const URL = [endpoints.key + endpoints.update, { user: userName, endpoints: 'chat' }];

  // to update local state based on key
  mutate(
    URL,
    (currentChat: any) => {
      const addedChat: ChatHistory[] = [...currentChat, newChat];
      return addedChat;
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  // const data = { chat: newChat };
  // await axios.post(endpoints.key + endpoints.update, data);
}

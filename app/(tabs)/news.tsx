import { Header } from '@components/layout-partials/Header';
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share
} from 'lucide-react-native';
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import postByPic from "@assets/images/my_pic.jpg";
export default function NewsScreen() {

  const posts = [
    {
      id: 1,
      author: 'Pankaj Kumar',
      avatar:postByPic,
      time: '2h ago',
      content:
        'The News section is a new feature currently in development and will be available in a future update. Any previews, titles, or sample content displayed at this time are for illustrative purposes only and do not represent actual news content.',
      image:
        'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      likes: 24,
      comments: 8,
      isLiked: false,
    },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <Header/>

      {/* Posts Feed */}
      <ScrollView className="flex-1 mt-14" contentContainerStyle={{ padding: 10 }}>
        {posts.map((post) => (
          <View key={post.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            {/* Post Header */}
            <View className="flex-row items-center mb-3">
              <Image source={post.avatar} className="w-10 h-10 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  {post.author}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">{post.time}</Text>
              </View>
              <TouchableOpacity>
                <MoreHorizontal size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Post Content */}
            <Text className="text-sm text-gray-800 leading-6 mb-3">{post.content}</Text>

            {/* Post Image */}
            {post.image && (
              <Image
                source={{ uri: post.image }}
                className="w-full h-52 rounded-md mb-3"
                resizeMode="cover"
              />
            )}

            {/* Post Actions */}
            <View className="flex-row items-center pt-3 border-t border-gray-100">
              <TouchableOpacity className="flex-row items-center mr-6">
                <Heart
                  size={20}
                  color={post.isLiked ? '#FF6B6B' : '#666'}
                  fill={post.isLiked ? '#FF6B6B' : 'none'}
                />
                <Text className={`text-sm ml-2 ${post.isLiked ? 'text-[#FF6B6B]' : 'text-gray-600'}`}>{post.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center mr-6">
                <MessageCircle size={20} color="#666" />
                <Text className="text-sm text-gray-600 ml-2">{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center">
                <Share size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

import InputNE from '@components/custom-ui/InputNE';
import {
  Bell,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const posts = [
    {
      id: 1,
      author: 'Sarah Wilson',
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      time: '2h ago',
      content:
        'Just finished reading an amazing book about productivity! The insights on time management have completely changed my daily routine. Highly recommend it to anyone looking to optimize their workflow.',
      image:
        'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      likes: 24,
      comments: 8,
      isLiked: false,
    },
    {
      id: 2,
      author: 'Mike Johnson',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      time: '4h ago',
      content:
        'Beautiful sunset from my morning hike today. Nature never fails to inspire and motivate me for the day ahead. Where is your favorite place to find inspiration?',
      image:
        'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg',
      likes: 156,
      comments: 23,
      isLiked: true,
    },
    {
      id: 3,
      author: 'Emma Davis',
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      time: '6h ago',
      content:
        'Excited to share my latest project! After months of hard work, we finally launched our new mobile app. The feedback has been incredible so far. Thank you to everyone who supported us on this journey!',
      likes: 89,
      comments: 31,
      isLiked: false,
    },
  ];

  const categories = ['All', 'Popular', 'Recent', 'Following'];

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-2 pt-2 pb-2 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800 mt-1">Community</Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity className="p-2">
            <Bell size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-5 pt-12 bg-white">
        <InputNE
          size="lg"
          searchBox
          placeholder="Search notes...."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View className="bg-white pb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              className={`px-4 py-2 mr-3 rounded-full ${
                selectedCategory === category ? 'bg-blue-500' : 'bg-gray-100'
              }`}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === category ? 'text-white' : 'text-gray-600'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts Feed */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {posts.map((post) => (
          <View key={post.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            {/* Post Header */}
            <View className="flex-row items-center mb-3">
              <Image source={{ uri: post.avatar }} className="w-10 h-10 rounded-full mr-3" />
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

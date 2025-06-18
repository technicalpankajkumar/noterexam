import InputNE from '@components/custom-ui/InputNE';
import { Bell, FileText } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function NotesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const notes = [
    {
      id: 1,
      title: 'Meeting Notes',
      content: 'Discussed project timeline and deliverables...',
      date: '2024-01-15',
      category: 'Work',
    },
    {
      id: 2,
      title: 'Shopping List',
      content: 'Milk, Eggs, Bread, Apples...',
      date: '2024-01-14',
      category: 'Personal',
    },
    {
      id: 3,
      title: 'Book Ideas',
      content: 'Collection of interesting book recommendations...',
      date: '2024-01-13',
      category: 'Reading',
    },
    {
      id: 4,
      title: 'Travel Plans',
      content: 'Summer vacation destinations and budget...',
      date: '2024-01-12',
      category: 'Travel',
    },
  ];

  const categories = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      Work: 'bg-blue-500',
      Personal: 'bg-green-500',
      Reading: 'bg-red-400',
      Travel: 'bg-orange-400',
    };
    return colors[category] || 'bg-gray-400';
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-2 pt-2 pb-2 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800 mt-1">Notes</Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity className="p-2">
            <Bell size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Search Bar */}
      <View className="px-5 pt-12  bg-white">
        <InputNE
          size='lg'
          searchBox
          placeholder='Search notes....'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View className="px-3 pt-2">
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="px-4  font-semibold rounded-xl p-2 items-center mr-4 shadow-sm bg-blue-400"
            >
              <Text className="text-sm font-medium text-center text-white " numberOfLines={1}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* Notes List */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15, paddingTop: 10 }}>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <View className='bg-white rounded-lg p-3 mb-2 shadow-sm'>
              <View key={note.id} className="flex-row justify-between items-center ">
                <Text className="text-sm text-gray-800 flex-1 font-semibold">{note.title}</Text>
                <TouchableOpacity
                  onPress={() => { }
                    // handleViewPDF(note.uri, note.title)
                  }
                >
                  <FileText size={16} color="#666" />
                </TouchableOpacity>

              </View>
              <Text className="text-sm text-gray-600 pt-2" numberOfLines={2}>{note.content}</Text>
            </View>
          ))

        ) : (
          <View className="items-center justify-center py-20">
            <FileText size={64} color="#ccc" />
            <Text className="text-xl font-bold text-gray-700 mt-4 mb-2">No notes found</Text>
            <Text className="text-base text-gray-500 text-center px-10">
              {searchQuery ? 'Try adjusting your search' : 'Create your first note to get started'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import InputNE from '@components/custom-ui/InputNE';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { Bell, FileText } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getAllPdf, getSemesters, getYears } from '../../utils/getSupabaseApi';

interface PdfFile {
  id: string;
  name: string;
  created_at: string;
}
export default function NotesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notes, setNotes] = useState<PdfFile[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [semesterData, setSemesterData] = useState<any[]>([]);
  const [yearData, setYearData] = useState<any[]>([]);

   const fetchSemester = async ()=>{
      const data = await getSemesters(null);
      setSemesterData(data)
    }
    const fetchYear = async ()=>{
      const data = await getYears(null);
      setYearData(data)
    }

  const fetchData = async () => {
    setLoading(true);
    let notes = await getAllPdf();
    setLoading(false);
    setNotes(notes);
  };
  useEffect(() => {
    fetchData();
    fetchSemester();
    fetchYear();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      fetchData()
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const categories = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

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
          size='md'
          prefixIcon
          placeholder='Search notes....'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View className="px-3 pt-2 bg-white">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {[{label:"All",value:''},...yearData].map((item) => (
            <TouchableOpacity
              key={item.value}
              className={`px-4 text-sm font-semibold rounded-xl p-1 items-center mr-4 shadow-sm ${selectedCategory === item.value ? 'bg-blue-400' : 'bg-gray-200'}`}
              onPress={() => setSelectedCategory(item.value)}
            >
              <Text className={`text-sm font-medium text-center ${selectedCategory === item.value ? 'text-white' : 'text-gray-800'}`} numberOfLines={1}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {[{label:"All",value:''},...semesterData].map((item) => (
            <TouchableOpacity
              key={item.value}
              className={`px-4 text-sm font-semibold rounded-xl p-1 items-center mr-4 shadow-sm ${selectedCategory === item.value ? 'bg-blue-400' : 'bg-gray-200'}`}
              onPress={() => setSelectedCategory(item.value)}
            >
              <Text className={`text-sm font-medium text-center ${selectedCategory === item.value ? 'text-white' : 'text-gray-800'}`} numberOfLines={1}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Notes List */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
      )
        :
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 15, paddingTop: 10 }}
          ListEmptyComponent={() => (
            <View className="items-center justify-center py-20">
              <FileText size={64} color="#ccc" />
              <Text className="text-xl font-bold text-gray-700 mt-4 mb-2">No notes found</Text>
              <Text className="text-base text-gray-500 text-center px-10">
                {searchQuery ? 'Try adjusting your search' : 'Create your first note to get started'}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity className="bg-white rounded-lg p-3 mb-2 shadow-sm" onPress={() => {
                router.push(`/pdf/${item.name}`);
              }}>
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-gray-800 flex-1 font-semibold">{item.name}</Text>
                  <FileText size={16} color="#666" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        />}
    </View>
  );
}

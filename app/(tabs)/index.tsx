import { Header } from '@components/layout-partials/Header';
import { useAuth } from '@contexts/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FileText, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getBooksDetails } from '../../utils/getSupabaseApi';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [courseLoading, setCourseLoading] = useState<boolean>(false);
  const [examLoading, setExamLoading] = useState<boolean>(false);
  const [bookData, setBookData] = useState<any[]>([]);
  const [courseRelatedData, setCourseRelatedData] = useState<any[]>([]);
  const [examPaperData, setExamPaperData] = useState<any[]>([]);

  const handleViewPDF = (uri: string, title: string) => {
    // router.push({ pathname: '/pdf/[id]', params: { id: uri?.split("/")?.[2], uri, title } });
    router.push({ pathname: `/pdf/${uri?.split("/")?.[2]}`, params: { uri, title } });

  };

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getBooksDetails({ page: 1, limit: 10, filters: { type : 'book'} });
      if (res.success) {
        setBookData(res.data);
      } else {
        Alert.alert('Fetch failed', res.error);
      }
    } catch (error) {
      Alert.alert("Error fetching data:", error?.toString() || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCourseRelated = async () => {
    setCourseLoading(true);
    try {
      const res = await getBooksDetails({ page: 1, limit: 10, filters: { type: "book", course_id: user?.course_id || '' } });
      if (res.success) {
        setCourseRelatedData(res.data);
      } else {
        Alert.alert('Fetch failed', res.error);
      }
    } catch (error) {
      Alert.alert("Error fetching data:", error?.toString() || "Something went wrong");
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchExamPapers = async () => {
    setExamLoading(true);
    try {
      const res = await getBooksDetails({ page: 1, limit: 10, filters: { type: "prev_paper", course_id: user?.course_id } });
      if (res.success) {
        setExamPaperData(res.data);
      } else {
        Alert.alert('Fetch failed', res.error);
      }
    } catch (error) {
      Alert.alert("Error fetching data:", error?.toString() || "Something went wrong");
    } finally {
      setExamLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    fetchCourseRelated();
    fetchExamPapers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const searchControl = () => {
    router.push({ pathname: '/(tabs)/notes', params: { searchEnable: 1 } });
  }

  const windowWidth = Dimensions.get('window').width;
  const isTablet = windowWidth >= 768;
  const numColumns = isTablet ? 4 : 2;

  // Main FlatList sections
  const sections = [
    { key: 'recentBooks' },
    { key: 'courseRelated' },
    { key: 'previousPapers' },
  ];

  const renderSection = ({ item }: { item: { key: string } }) => {
    switch (item.key) {
      case 'recentBooks':
        return (
          <View className="px-3 mb-4">
            <Text className="text-base md:text-lg font-bold text-white mb-2 bg-blue-800 px-2 py-1 shadow-sm rounded-md">Recent Books</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
            ) : (
              <FlatList
                data={bookData}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="w-32 bg-white rounded-xl p-2 items-center mr-4 shadow-sm "
                    onPress={() => handleViewPDF(item.document_url, item.title)}
                  >
                    <Image
                      source={{ uri: item.thumbnail_url ?? "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4" }}
                      className="w-28 h-32 rounded-lg mb-2"
                    />
                    <Text className="text-xs md:text-sm font-medium text-center text-gray-800 mb-1" numberOfLines={2}>{item.title}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="flex flex-col items-center justify-evenly min-h-[130px] bg-white rounded-xl shadow-sm p-6">
                    <FileText size={30} color={'#9ca3af'} />
                    <Text className="text-sm text-gray-400 mb-1">No Book Available</Text>
                  </View>
                }
              />
            )}
          </View>
        );
      case 'courseRelated':
        return (
          <View className="px-3 max-h-96 mb-4">
            <Text className="text-base md:text-lg font-bold text-white mb-2 bg-blue-800 px-2 py-1 shadow-sm rounded-md">Related To Course</Text>
            {courseLoading ? (
              <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
            ) : (
              <FlatList
                data={courseRelatedData}
                numColumns={numColumns}
                key={numColumns}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between', flexDirection: 'row' } : undefined}
               renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row', // image left, text right
                    alignItems: 'flex-start',
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    padding: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                    width: (windowWidth - 32 - (numColumns - 1) * 12) / numColumns,
                  }}
                  onPress={() => handleViewPDF(item.document_url, item.title)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri:
                        item.thumbnail_url ??
                        'https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4',
                    }}
                    style={{
                      width: 54,
                      height: 60,
                      borderRadius: 8,
                      marginRight: 6,
                      backgroundColor: '#f3f4f6',
                      borderColor: "gray",
                      borderWidth: 1
                    }}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      className="text-xs font-medium text-gray-800"
                      numberOfLines={4}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
                ListEmptyComponent={
                  <View className="flex flex-col items-center justify-evenly max-h-[100px] bg-white rounded-xl shadow-sm p-4">
                    <FileText size={30} color={'#9ca3af'} />
                    <Text className="text-sm text-gray-400 mt-2">No Related Notes Available</Text>
                  </View>
                }
              />)
            }
          </View>
        );
      case 'previousPapers':
        return (
          <View className="px-3 max-h-96 mb-4">
            <Text className="text-base md:text-lg font-bold text-white mb-2 bg-blue-800 px-2 py-1 shadow-sm rounded-md">
              Previous Exam Paper's
            </Text>
            {examLoading ? (
              <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
            ) : (
              <FlatList
                data={examPaperData}
                numColumns={numColumns}
                key={numColumns + '-papers'}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={
                  numColumns > 1
                  ? { justifyContent: 'space-between', flexDirection: 'row' }
                  : undefined
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row', // image left, text right
                    alignItems: 'flex-start',
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    padding: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                    width: (windowWidth - 32 - (numColumns - 1) * 12) / numColumns,
                  }}
                  onPress={() => handleViewPDF(item.document_url, item.title)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri:
                        item.thumbnail_url ??
                        'https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4',
                    }}
                    style={{
                      width: 54,
                      height: 60,
                      borderRadius: 8,
                      marginRight: 6,
                      backgroundColor: '#f3f4f6',
                      borderColor: "gray",
                      borderWidth: 1
                    }}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      className="text-xs font-medium text-gray-800"
                      numberOfLines={4}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="flex flex-col items-center justify-evenly max-h-[100px] bg-white rounded-xl shadow-sm p-4">
                  <FileText size={30} color={'#9ca3af'} />
                  <Text className="text-sm text-gray-400 mb-1">
                    No Related Paper's Available
                  </Text>
                </View>
              }
            />)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <Header searchControl={searchControl} />
      {/* Main FlatList for sections */}
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingTop: 55, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { 
            fetch();}} />
        }
      />

      {/* Floating Action Button */}
      {(['admin','coordinator'].includes(user?.type) ) && <TouchableOpacity className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-blue-800 justify-center items-center shadow-lg" onPress={() => router.push('/pdf')}>
        <Plus size={24} color="white" />
      </TouchableOpacity>}
    </View>
  );
}
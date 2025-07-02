import ActionSheetNE from '@components/custom-ui/ActionSheetNE';
import UploadFileSheetNE from '@components/custom-ui/UploadFileSheetNE';
import { useAuth } from '@contexts/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Bell, FileText, Plus, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getBooksDetails } from '../../utils/getSupabaseApi';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const isFocused = useIsFocused()
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showActionsheet, setShowActionsheet] = useState(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [bookData, setBookData] = useState<any>([]);

  const quickActions = [
    { id: 1, title: 'Upload Notes', icon: '📝', color: 'bg-blue-500' },
    { id: 2, title: 'Join Community', icon: '👥', color: 'bg-green-500' },
  ];

  const courseWisePDFs = [
    {
      course: 'Machanical',
      files: [
        { id: 'm1', title: 'Algebra Notes', uri: 'https://example.com/algebra.pdf', date: "12/09/2014", content: "Algebra is a branch of mathematics." },
        { id: 'm2', title: 'Calculus Guide', uri: 'https://example.com/calculus.pdf', date: "12/09/2014", content: "Calculus is a branch of mathematics." },
      ],
    },
    {
      course: 'Computer Science',
      files: [
        { id: 'cs1', title: 'Data Structures', uri: 'https://example.com/ds.pdf', date: "12/09/2014", content: "Data Structure is a Body of Computer science." },
        { id: 'cs2', title: 'Algorithms', uri: 'https://example.com/algo.pdf', date: "12/09/2014", content: "Algorithm is a set of rules to solve a problem." },
      ],
    },
  ];

  const recentActivity = [
    { id: 1, title: 'New note created', time: '2 hours ago' },
    { id: 2, title: 'Community post liked', time: '4 hours ago' },
    { id: 3, title: 'Profile updated', time: '1 day ago' },
  ];

  const handleViewPDF = (uri: string, title: string) => {

    router.push({ pathname: `/pdf/${uri?.split("/")?.[2]}`, params: { uri, title } });
  };

  const fetch = async () => {
    setRefreshing(true);
    try {
      const res = await getBooksDetails({ page: 1, limit: 10, filters: { type: "book" } });
      if (res.success) {
        setBookData(res.data);
        console.log('Total Pages:', res.totalPages);
      } else {
        Alert.alert('Fetch failed', res.error);
      }
    } catch (error) {
      Alert.alert("Error fetching data:", error?.toString() || "Something went wrong");
    } finally {
      setRefreshing(false);
    }
  }

  const handleCloseActionSheetNE = () => {
    setShowActionsheet(false);
    fetch();
  };


  useEffect(() => {
    fetch();
  }, [isFocused])

  return (
    <>
      <View className="flex-1 bg-gray-100">
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-2 pt-2 pb-3 bg-white border-b border-gray-200">
          <View>
            <Text className="text-2xl font-bold text-gray-800 mt-1">{user?.name || 'Guest'}</Text>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="p-2">
              <Search size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <Bell size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 65 }} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View className="px-3 mb-2 ">
            <View className="flex-row flex-wrap justify-between">
              {!uploadLoading ? quickActions.map((action) => (
                <TouchableOpacity key={action.id} className="w-[47%] bg-white rounded-xl p-4 items-center mb-4 shadow" onPress={() => {
                  if (action.title == 'Upload Notes') setShowActionsheet(true);
                }}>
                  <View className={`w-12 h-12 rounded-full justify-center items-center mb-3 ${action.color}`}>
                    <Text className="text-xl">{action.icon}</Text>
                  </View>
                  <Text className="text-sm font-medium text-center text-gray-800">{action.title}</Text>
                </TouchableOpacity>
              )) : <ActivityIndicator size="large" />}
            </View>
          </View>

          {/* Recent Books */}
          <View className="px-3 mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">Recent Books</Text>
           { refreshing ? (
            <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
          )
           :
            <FlatList
              data={bookData}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="w-36 bg-white rounded-xl p-2 items-center mr-4 shadow-sm"
                  onPress={() => handleViewPDF(item.document_url, item.title)}
                >
                  <Image source={{ uri: item.thumbnail_url ?? "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4" }} className="w-32 h-28 rounded-lg mb-2" />
                  <Text className="text-sm font-medium text-center text-gray-800 mb-1" numberOfLines={2}>{item.title}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<View className="flex flex-col items-center justify-evenly min-h-[130px] bg-white rounded-xl shadow-sm p-6">
                <FileText size={30} color={'#9ca3af'} />
                <Text className="text-sm text-gray-400 mb-1">No Book Available</Text>
              </View>
              }
            />
}
          </View>

          {/* Course-wise PDFs */}
          <View className="px-3 ">
            <Text className="text-xl font-bold text-gray-800 mb-4 bg-white rounded-md p-2">Course-Wise PDF</Text>
            {courseWisePDFs.map((course) => (
              <View key={course.course} className="mb-2">
                <Text className="text-base font-bold text-blue-500 mb-2">{course.course}</Text>
                {course.files.map((file) => (
                  <TouchableOpacity key={file.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm" onPress={() => handleViewPDF(file.uri, file.title)}>
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-lg font-semibold text-gray-800 flex-1">{file.title}</Text>
                      <Text className="text-xs text-gray-500 ml-2">{file?.date}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>{file?.content}</Text>
                      <FileText size={16} color="#666" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Recent Activity */}
          <View className="px-3 mb-12">
            <Text className="text-xl font-bold text-gray-800 mb-4">Recent Activity</Text>
            <View className="bg-white rounded-xl p-4 shadow-sm">
              {recentActivity.map((activity) => (
                <View key={activity.id} className="flex-row items-center py-3 border-b border-gray-100">
                  <View className="w-2 h-2 rounded-full bg-blue-500 mr-4" />
                  <View className="flex-1">
                    <Text className="text-base text-gray-800 mb-1">{activity.title}</Text>
                    <Text className="text-sm text-gray-500">{activity.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-blue-500 justify-center items-center shadow-lg">
          <Plus size={24} color="white" />
        </TouchableOpacity>

      </View>
      {
        showActionsheet && <View>
          <ActionSheetNE
            children={<UploadFileSheetNE userId={user?.id} handleCloseActionSheetNE={handleCloseActionSheetNE} />}
            showActionsheet={showActionsheet}
            setShowActionsheet={setShowActionsheet}
            handleClose={handleCloseActionSheetNE}
          />
        </View>
      }
    </>
  );
}
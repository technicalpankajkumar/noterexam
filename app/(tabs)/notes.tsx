import InputNE from '@components/custom-ui/InputNE';
import { Header } from '@components/layout-partials/Header';
import { useAuth } from '@contexts/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { FileText } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getBooksDetails, getSemesters, getYears } from '../../utils/getSupabaseApi';

interface PdfFile {
  id: string;
  name: string;
  created_at: string;
}

const windowWidth = Dimensions.get('window').width;
const isTablet = windowWidth >= 768;
const numColumns = isTablet ? 4 : 2;
export default function NotesScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const localSearchEnable = params?.searchEnable;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(user?.branch_year_semesters?.year_id);
  const [selectedSemester, setSelectedSemester] = useState(user?.branch_year_semesters?.semester_id);
  const [notes, setNotes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [semesterData, setSemesterData] = useState<any[]>([]);
  const [yearData, setYearData] = useState<any[]>([]);
  const [searchEnable, setSearchEnable] = useState(false);
  const [clientParams, setClientParams] = useState({
    page: 1,
    limit: 10,
    filters: {
      semester_id: user?.branch_year_semesters?.semester_id,
      year_id: user?.branch_year_semesters?.year_id
    },
    searchTerm: ''
  })

  const fetchSemester = async () => {
    const data = await getSemesters(null);
    setSemesterData(data)
  }
  const fetchYear = async () => {
    const data = await getYears(null);
    setYearData(data)
  }

  const fetchData = async () => {
    setLoading(true);
    const res = await getBooksDetails(clientParams);
    setLoading(false);
    setNotes(res?.data);
  };
  useEffect(() => {
    setSearchEnable(localSearchEnable == '1' ? true : false);
    router.setParams({ searchEnable: 0 })
    if (yearData?.length == 0 || semesterData?.length == 0) {
      fetchSemester();
      fetchYear();
    }
  }, [isFocused]);

  useEffect(() => {
    fetchData();
  }, [clientParams])

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

  const handleViewPDF = (uri: string, title: string) => {
    router.push({ pathname: `/pdf/${uri?.split("/")?.[2]}`, params: { uri, title } });
  };

  const handleFilter = (value: string, name: string) => {
    if (name == 'year') {
      setSelectedYear(value);
      setClientParams(pre => ({ ...pre, filters: { ...pre.filters, year_id: value } }))
    }
    if (name == 'semester') {
      setSelectedSemester(value);
      setClientParams(pre => ({ ...pre, filters: { ...pre.filters, semester_id: value } }))
    }
  }

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header searchControl={() => setSearchEnable(pre => !pre)} />
      {/* Search Bar */}
      {/* Outside click overlay for search bar */}
      {searchEnable && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9,
          }}
          onPress={() => setSearchEnable(false)}
        />
      )}
      {searchEnable && <View className="px-2 absolute top-12 left-0 right-0 z-10">
        <View className='bg-white shadow-lg rounded-md border border-gray-200 px-2 py-1 shadow-black'>
          <InputNE
            size='lg'
            prefixIcon
            placeholder='Search notes....'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>}
      <View className="px-3 pt-2 bg-white mt-14">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {[{ label: "All", value: '' }, ...yearData].map((item) => (
            <TouchableOpacity
              key={item.value}
              className={`px-4 text-sm font-semibold rounded-xl p-1 items-center mr-4 shadow-sm ${selectedYear === item.value ? 'bg-blue-400' : 'bg-gray-200'}`}
              onPress={() => handleFilter(item.value, 'year')}
            >
              <Text className={`text-sm font-medium text-center ${selectedYear === item.value ? 'text-white' : 'text-gray-800'}`} numberOfLines={1}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {[{ label: "All", value: '' }, ...semesterData].map((item) => (
            <TouchableOpacity
              key={item.value}
              className={`px-4 text-sm font-semibold rounded-xl p-1 items-center mr-4 shadow-sm ${selectedSemester === item.value ? 'bg-blue-400' : 'bg-gray-200'}`}
              onPress={() => handleFilter(item.value, 'semester')}
            >
              <Text className={`text-sm font-medium text-center ${selectedSemester === item.value ? 'text-white' : 'text-gray-800'}`} numberOfLines={1}>{item.label}</Text>
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
          numColumns={numColumns}
          key={numColumns + '-papers'}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle={
            numColumns > 1
              ? { justifyContent: 'space-between', flexDirection: 'row' }
              : undefined
          }
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
            <TouchableOpacity
              style={{
                width: (windowWidth - 32 - (numColumns - 1) * 12) / numColumns,
                marginBottom: 12,
              }}
              className="bg-white rounded-xl p-2 shadow-lg shadow-black flex-col items-center"
              onPress={() => handleViewPDF(item?.document_url, item?.title)}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri:
                    item?.thumbnail_url ??
                    'https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4',
                }}
                className="w-full h-44 rounded-lg mb-2"
                resizeMode="cover"
              />
              <View style={{ width: '100%' }}>
                <Text
                  className="text-xs font-medium text-center text-gray-800 mb-1 px-1"
                  style={{ flexShrink: 1, flexWrap: 'wrap' }}
                  numberOfLines={4} // Remove this line if you want full wrapping
                  ellipsizeMode="tail"
                >
                  {item?.title || "Here Title"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />}
    </View>
  );
}

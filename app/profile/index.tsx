import ButtonNE from "@components/custom-ui/ButtonNE";
import InputNE from "@components/custom-ui/InputNE";
import SelectNE from "@components/custom-ui/SelectNE";
import { Header } from "@components/layout-partials/Header";
import { useAuth } from "@contexts/AuthContext";
import { useIsFocused } from "@react-navigation/native";
import { Camera } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { getBranches, getColleges, getCourses, getSemesters, getUniversity, getYears } from "../../utils/getSupabaseApi";


const ProfileScreen = () => {
  const { user ,updateProfile} = useAuth();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [universityData, setUniversityData] = useState<{ label: string, value: string }[]>([])
  const [collegeData, setCollegeData] = useState<{ label: string, value: string }[]>([]);
  const [courseData, setCourseData] = useState<{ label: string, value: string }[]>([]);
  const [branchData, setBranchData] = useState<{ label: string, value: string }[]>([]);
  const [semesterData, setSemesterData] = useState<{ label: string, value: string }[]>([]);
  const [yearData, setYearData] = useState<{ label: string, value: string }[]>([]);

  const { control, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm();

  const fetchUniversity = async () => {
    const data = await getUniversity(null);
    setUniversityData(data)
  };
  const fetchColleges = async (universityId: string) => {
    const data = await getColleges({ searchTerm: null, universityId })
    setCollegeData(data)
  }
  const fetchCourse = async (collegeId: string) => {
    const data = await getCourses({ collegeId })
    setCourseData(data)
  }
  const fetchBranches = async (courseId: string) => {
    const data = await getBranches({ courseId })
    setBranchData(data)
  }
  const fetchSemester = async () => {
    const data = await getSemesters(null);
    setSemesterData(data)
  }
  const fetchYear = async () => {
    const data = await getYears(null);
    setYearData(data)
  }
console.log(user)
  useEffect(() => {
    if(user?.name) {
      setValue("name", user?.name)
      setValue("mobile", user?.mobile)
      setValue("profile_image", user?.profile_image || "")
      setValue("type", user?.type || "student");
      setValue("university", user?.university_id || "")
      setValue("college", user?.college_id || "")
      setValue("course", user?.course_id || "")
      setValue("branch", user?.branch_year_semesters?.branch_id || "")
      setValue("semester", user?.branch_year_semesters?.semester_id || "")
      setValue("year", user?.branch_year_semesters?.year_id || "")
    }
    setValue("email", user?.email)
    
    fetchUniversity();
    fetchSemester();
    fetchYear();
    if(user?.college_id){
      fetchCourse(user?.college_id)
    }
    if(user?.university_id){
      fetchColleges(user?.university_id)
    }
    if(user?.course_id){
      fetchBranches(user?.course_id)
    }
  }, [isFocused])


  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      let hit = !!user?.name
      await updateProfile(data,hit)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

  const returnFieldWiseList = (field: string) => {
    switch (field) {
      case 'university':
        return universityData;
      case 'college':
        return collegeData;
      case 'course':
        return courseData;
      case 'branch':
        return branchData;
      case 'year':
        return yearData;
      case 'semester':
        return semesterData;
      default:
        return [];
    }
  }
  const listApiCall = (field: string, e: any) => {

    if (field == 'university') {
      fetchColleges(e)
    }
    else if (field == 'college') {
      fetchCourse(e)
    }
    else if (field == 'course') {
      fetchBranches(e)
    }
  }


  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      {/* <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-2 pt-2 pb-2 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800 mt-1">Edit Profile</Text>
      </View> */}
      <Header backButton />
      <ScrollView className="flex-1 mt-14" showsVerticalScrollIndicator={false}>
        <View className="bg-white py-4 items-center mb-1">
          <View className="relative mb-1">
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full justify-center items-center border-2 border-white">
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-full px-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, value } }) => (
              <InputNE
                placeholder="Enter your name"
                type="text"
                value={value}
                onChangeText={onChange}
                title="Name"
                isRequired={true}
                error={typeof errors?.name?.message === 'string' ? errors.name.message : undefined}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email ID is required' }}
            render={({ field: { onChange, value } }) => (
              <InputNE
                placeholder="Enter your email"
                type="text"
                value={value}
                onChangeText={onChange}
                title="Email"
                isRequired={true}
                disabled
                error={typeof errors?.email?.message === 'string' ? errors.email.message : undefined}
              />
            )}
          />
          <Controller
            name="mobile"
            control={control}
            rules={{ required: 'Mobile is required' }}
            render={({ field: { onChange, value } }) => (
              <InputNE
                placeholder="Enter your mobile"
                type="text"
                value={value}
                onChangeText={onChange}
                title="Mobile"
                isRequired={true}
                error={typeof errors?.mobile?.message === 'string' ? errors.mobile.message : undefined}
              />
            )}
          />
          <Controller
            name="university"
            control={control}
            rules={{ required: 'University is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <SelectNE
                title="University"
                placeholder="Select university"
                options={universityData}
                onChange={(e: any) => {
                  listApiCall('university', e);
                  onChange(e);
                }}
                isRequired
                error={typeof error?.message === 'string' ? error.message : undefined}
                value={returnFieldWiseList('university')?.filter((item) => item.value === value)[0]?.label || ''}
              />
            )}
          />
          <Controller
            name="college"
            control={control}
            rules={{ required: 'College is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <SelectNE
                title="College"
                placeholder="Select college"
                options={collegeData}
                onChange={(e: any) => {
                  listApiCall('college', e);
                  onChange(e);
                }}
                isRequired
                error={typeof error?.message === 'string' ? error.message : undefined}
                value={returnFieldWiseList('college')?.filter((item) => item.value === value)[0]?.label || ''}
              />
            )}
          />
          <Controller
            name="course"
            control={control}
            rules={{ required: 'Course is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <SelectNE
                title="Course"
                placeholder="Select course"
                options={courseData}
                onChange={(e: any) => {
                  listApiCall('course', e);
                  onChange(e);
                }}
                isRequired
                error={typeof error?.message === 'string' ? error.message : undefined}
                value={returnFieldWiseList('course')?.filter((item) => item.value === value)[0]?.label || ''}
              />
            )}
          />
          <Controller
            name="branch"
            control={control}
            rules={{ required: 'Branch is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <SelectNE
                title="Branch"
                placeholder="Select branch"
                options={branchData}
                onChange={onChange}
                isRequired
                error={typeof error?.message === 'string' ? error.message : undefined}
                value={returnFieldWiseList('branch')?.filter((item) => item.value === value)[0]?.label || ''}
              />
            )}
          />
          <Controller
            name="semester"
            control={control}
            rules={{ required: 'Semester is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <SelectNE
                title="Semester"
                placeholder="Select semester"
                options={semesterData}
                onChange={onChange}
                isRequired
                error={typeof error?.message === 'string' ? error.message : undefined}
                value={returnFieldWiseList('semester')?.filter((item) => item.value === value)[0]?.label || ''}
              />
            )}
          />
          <Controller
            name="year"
            control={control}
            rules={{ required: 'Batch is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <SelectNE
                title="Batch"
                placeholder="Select Batch"
                options={yearData}
                onChange={onChange}
                isRequired
                error={typeof error?.message === 'string' ? error.message : undefined}
                value={returnFieldWiseList('year')?.filter((item) => item.value === value)[0]?.label || ''}
              />
            )}
          />
          <ButtonNE
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            title="Update"
          />
        </View>
      </ScrollView>
    </View>
  )

}

export default ProfileScreen



import { AlertCircleIcon, UploadCloud } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { selectFileNoteByDevice, selectImageByDevice } from "../../utils/FileUploadHelper";
import { getBranches, getColleges, getCourses, getUniversity, postUniversityOrCollegeOrCourseEtc } from "../../utils/getSupabaseApi";
import ButtonNE from "./ButtonNE";
import CheckBoxNE from "./CheckBoxNE";
import InputNE from "./InputNE";
import SelectNE from "./SelectNE";
import TextAreaNE from "./TextAreaNE";


const UploadFileSheetNE = () => {
  const [fallbackFields, setFallbackFields] = useState<Record<string, boolean>>({});
  const { control, handleSubmit, formState: { errors }, watch } = useForm();
  const [universityData, setUniversityData] = useState<{ label: string, value: string, id: string }[]>([])
  const [collegeData, setCollegeData] = useState<{ label: string, value: string, id: string }[]>([]);
  const [courseData, setCourseData] = useState<{ label: string, value: string, id: string }[]>([]);
  const [branchData, setBranchData] = useState<{ label: string, value: string, id: string }[]>([]);

  const onSubmit = async (data: any) => {
    console.log('Form Data:', data);
    const res = await postUniversityOrCollegeOrCourseEtc({
      university_name: data.university,
      college_name: data.college,
      course_name: data.course,
      branch_name: data.branch,
      year: data.year,
      semester: data.semester,
    })
    console.log(res, "===================");
  };
  // console.log(watch('university')); //get value of selected university

  const fetchData = async () => {
    const data = await getUniversity(null);
    setUniversityData(data)
  };
  const fetchColleges = async (universityId: string) => {
    const data = await getColleges({
      searchTerm: null,
      universityId
    })
    setCollegeData(data)
  }
  const fetchCourse = async (collegeId: string) => {
    const data = await getCourses({
      collegeId
    })
    setCourseData(data)
  }
  const fetchBranches = async (courseId: string) => {
    const data = await getBranches({
      courseId
    })
    setBranchData(data)
  }



  useEffect(() => {
    fetchData();
  }, []);

  const fields = ['university', 'college', 'course', 'branch', 'year', 'semester',];
  const yearData = [
    { label: '1st Year', value: '1', id: '1' },
    { label: '2nd Year', value: '2', id: '2' },
    { label: '3rd Year', value: '3', id: '3' },
    { label: '4th Year', value: '4', id: '4' },
    { label: '5th Year', value: '5', id: '5' },
  ];
  const semesterData = [
    { label: '1st Semester', value: '1', id: '1' },
    { label: '2nd Semester', value: '2', id: '2' },
    { label: '3rd Semester', value: '3', id: '3' },
    { label: '4th Semester', value: '4', id: '4' },
    { label: '5th Semester', value: '5', id: '5' },
    { label: '6th Semester', value: '6', id: '6' },
  ];
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
    console.log(e,'=========')
    if (field == 'university') {
      fetchColleges(e.value)
    }
    else if (field == 'college') {
      fetchCourse(e.value)
    }
    else if (field == 'course') {
      fetchBranches(e.value)
    }
  }


  return (<View className="w-full h-[450px]">
    <ScrollView showsVerticalScrollIndicator={false}>
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title is required' }}
        render={({ field: { onChange, value } }) => (
          <InputNE
            placeholder="Title"
            type="text"
            value={value}
            onChangeText={onChange}
            size="sm"
            title="Title"
            isRequired={true}
            error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
          />
        )}
      />
      {/* Description */}
      <Controller
        name="description"
        control={control}
        rules={{ required: 'Description is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextAreaNE onChange={onChange} isRequired error={typeof error?.message === 'string' ? error.message : undefined} />
        )}
      />

      <Controller
        name="type"
        control={control}
        rules={{ required: 'Type is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <SelectNE
            options={[
              { label: 'Book', value: 'book', id: '1' },
              { label: 'Model/Quantum Paper', value: 'model_paper', id: '2' },
              { label: 'Notes', value: 'notes', id: '3' }
            ]}
            onChange={onChange}
            isRequired
            error={typeof error?.message === 'string' ? error.message : undefined}
          />
        )}
      />

      {/* Dynamic Selects or Inputs */}
      {fields.map((field) => (
        <View key={field} className="space-y-1">
          <View className="flex-row items-center justify-between">
            <CheckBoxNE
              isChecked={fallbackFields[field]}
              onChange={() =>
                setFallbackFields((prev) => ({ ...prev, [field]: !prev[field] }))
              }
              aria-label={`Use custom ${field}`}
              title={'Not exist'}
            />
          </View>
          <Controller
            name={field}
            control={control}
            rules={{ required: `${field} is required` }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return fallbackFields[field] ? (
                <InputNE
                  placeholder={`Enter ${field}`}
                  value={value}
                  onChangeText={onChange}
                  title={field}
                  error={typeof error?.message === 'string' ? error.message : undefined}
                />
              ) : (
                <SelectNE
                  options={returnFieldWiseList(field)}
                  title={field}
                  error={typeof error?.message === 'string' ? error.message : undefined}
                  onChange={(e: any) => {
                    listApiCall(field,e);
                    onChange(e);
                  }}
                />
              )
            }
            }
          />
        </View>
      ))}

      <Controller
        name="pdf_path"
        control={control}
        rules={{ required: 'PDF is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TouchableOpacity
              onPress={async () => {
                const file = await selectFileNoteByDevice();
                onChange(file?.path);
              }
              }
            >
              <Text className="text-sm font-medium ">Choose Notes</Text>
              <View className="my-2 items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[60px] w-full">
                <UploadCloud className="h-[50px] w-[50px] stroke-background-200" />
                <Text className="text-sm">
                  {value ? value : 'Choose notes from device'}
                </Text>
              </View>
            </TouchableOpacity>
            {error && (
              <Text className="text-red-700 text-sm mb-2"><AlertCircleIcon size={14} color={'#b91c1c'} className="me-2" /> {error.message}</Text>
            )}
          </>
        )}
      />
      {/* Thumbnail */}
      <Controller
        name="thumbnail"
        control={control}
        rules={{ required: 'Thumbnail is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TouchableOpacity
              onPress={async () => {
                const file = await selectImageByDevice();
                onChange(file?.fileName);
              }
              }
              className=""
            >
              <Text className="text-sm font-medium ">Choose Thumbnail</Text>
              <View className="my-2 items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[60px] w-full">
                <UploadCloud className="h-[50px] w-[50px] stroke-background-200" />
                <Text className="text-sm">
                  {value ? value : 'Choose thumbnail from device'}
                </Text>
              </View>
            </TouchableOpacity>
            {error && (
              <Text className="text-red-700 text-sm mb-2"><AlertCircleIcon size={14} color={'#b91c1c'} className="me-2" /> {error.message}</Text>
            )}
          </>
        )}
      />

      <ButtonNE
        onPress={handleSubmit(onSubmit)}
        // onPress={staticFn}
        loading={false}
        title="Upload"
      />
    </ScrollView>
  </View>)
}

export default UploadFileSheetNE;
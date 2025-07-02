
import { AlertCircleIcon, UploadCloud } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { capitalizeFirstLetter } from "../../helpers/capitalizeFirstLetter";
import { selectFileNoteByDevice, selectImageByDevice, uploadFileServer, uploadImageServer } from "../../utils/FileUploadHelper";
import { getBranches, getColleges, getCourses, getSemesters, getUniversity, getYears, postDocDetails, postUniversityOrCollegeOrCourseEtc } from "../../utils/getSupabaseApi";
import ButtonNE from "./ButtonNE";
import CheckBoxNE from "./CheckBoxNE";
import InputNE from "./InputNE";
import SelectNE from "./SelectNE";
import TextAreaNE from "./TextAreaNE";

type FileNoteType =
  | { success: true; fileBlob: Blob; path: string; fileName: string }
  | { success: false; error: unknown }
  | undefined;

type ThumbnailType =
  | { filePath: string; base64: string; contentType: string; fileName: string }
  | undefined;


const UploadFileSheetNE = ({ userId }: { userId: string }) => {
  const [fallbackFields, setFallbackFields] = useState<Record<string, boolean>>({});
  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [universityData, setUniversityData] = useState<{ label: string, value: string }[]>([])
  const [collegeData, setCollegeData] = useState<{ label: string, value: string }[]>([]);
  const [courseData, setCourseData] = useState<{ label: string, value: string }[]>([]);
  const [branchData, setBranchData] = useState<{ label: string, value: string }[]>([]);
  const [semesterData, setSemesterData] = useState<{ label: string, value: string }[]>([]);
  const [yearData, setYearData] = useState<{ label: string, value: string }[]>([]);

  const [filesData, setFilesData] = useState<{
    fileNote: FileNoteType;
    thumbnail: ThumbnailType;
  }>({
    fileNote: undefined,
    thumbnail: undefined,
  })
  const fileBufferRef = useRef<Uint8Array | null>(null);
  const [bufferLoading, setBufferLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setUploadLoading(true);
      const res = await postUniversityOrCollegeOrCourseEtc({
        university_name: data.university,
        college_name: data.college,
        course_name: data.course,
        branch_name: data.branch,
        year_id: data.year,
        semester_id: data.semester,
      })

      const res2 = await uploadFileServer({
        fileBuffer: fileBufferRef.current,
        path: filesData?.fileNote?.path
      });

      if (res2.exists) {
        Alert.alert("File Already Exist!")
        return
      }

      const res3 = await uploadImageServer({
        filePath: filesData?.thumbnail?.filePath,
        base64: filesData?.thumbnail?.base64,
        contentType: filesData?.thumbnail?.contentType
      });

      if (res3.exists) {
        Alert.alert("Thumbnail Already Exist!")
        return
      }

      const thumbnail_url = res3?.fileUrl ?? "";
      const document_url = res2?.data?.fullPath ?? "";

      const payload = {
        user_id: userId,
        title: data.title,
        description: data.description,
        university_id: res.university_id,
        college_id: res.college_id,
        course_id: res.course_id,
        branch_year_semesters_id: res.branch_year_semesters_id,
        type: data.type,
        document_url,
        thumbnail_url
      }
      const response = await postDocDetails(payload);
      console.log('Response:', response);
      
      if (response.status === 'success') {
        reset();
        Alert.alert("Notes Uploaded Successfully!");
      } else {
        Alert.alert("Error", response.msg || "Something went wrong")
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while uploading the file.");
    } finally {
      setUploadLoading(false)
    }
  };

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
  const fetchSemester = async ()=>{
    const data = await getSemesters(null);
    setSemesterData(data)
  }
  const fetchYear = async ()=>{
    const data = await getYears(null);
    setYearData(data)
  }

  useEffect(() => {
    fetchUniversity();
    fetchSemester();
    fetchYear();
  }, []);

  const notesTypeList = [
              { label: 'Book', value: 'book' },
              { label: 'Model/Quantum Paper', value: 'quantum'},
              { label: 'Notes', value: 'notes'}
            ]

  const fields = ['university', 'college', 'course', 'branch', 'year', 'semester'];
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
          <TextAreaNE onChange={onChange} isRequired error={typeof error?.message === 'string' ? error.message : undefined} value={value} />
        )}
      />

      <Controller
        name="type"
        control={control}
        rules={{ required: 'Type is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <SelectNE
            options={notesTypeList}
            onChange={onChange}
            isRequired
            error={typeof error?.message === 'string' ? error.message : undefined}
            value={notesTypeList?.filter((item) => item.value === value)[0]?.label || ''}
          />
        )}
      />

      {/* Dynamic Selects or Inputs */}
      {fields.map((field) => (
        <View key={field} className="space-y-1">
          <View className="flex-row items-center justify-between">
            {!(['year', 'semester'].includes(field)) && <CheckBoxNE
              isChecked={fallbackFields[field]}
              onChange={() =>
                setFallbackFields((prev) => ({ ...prev, [field]: !prev[field] }))
              }
              aria-label={`Use custom ${field}`}
              title={'Not exist'}
            />}
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
                  title={capitalizeFirstLetter(field)}
                  error={typeof error?.message === 'string' ? error.message : undefined}
                />
              ) : (
                <SelectNE
                  placeholder={`Select ${field}`}
                  options={returnFieldWiseList(field)}
                  title={capitalizeFirstLetter(field)}
                  error={typeof error?.message === 'string' ? error.message : undefined}
                  onChange={(e: any) => {
                    listApiCall(field, e);
                    onChange(e);
                  }}
                value={returnFieldWiseList(field)?.filter((item) => item.value === value)[0]?.label || ''} // Ensure value is set correctly
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
                setBufferLoading(true);
                const fileNote = await selectFileNoteByDevice();
                onChange(fileNote?.fileName);
                const { fileBuffer, ...fileNoteMeta } = fileNote || {};
                fileBufferRef.current = fileNote?.fileBuffer;
                setFilesData(pre => ({
                  ...pre,
                  fileNote: fileNoteMeta
                }))
                onChange(fileNote?.path);
                setBufferLoading(false)
              }
              }
            >
              <Text className="text-sm font-medium ">Choose Notes</Text>
              <View className="my-2 items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[60px] w-full">
                <UploadCloud className="h-[50px] w-[50px] stroke-background-200" />
                {bufferLoading ? <ActivityIndicator size="small" color="#4A90E2" /> : <Text className="text-sm">
                  {value ? value : 'Choose notes from device'}
                </Text>}
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
                const thumbnail = await selectImageByDevice();
                setFilesData(pre => ({
                  ...pre,
                  thumbnail
                }));
                onChange(thumbnail?.fileName);
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
        loading={uploadLoading}
        title="Upload"
      />
    </ScrollView>
  </View>)
}

export default UploadFileSheetNE;
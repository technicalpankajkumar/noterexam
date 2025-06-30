import { supabase } from "@lib/supabase";
import { Alert } from "react-native";


const handleQuery = ({ query, searchTerm }: { query: any; searchTerm?: string | null }) => {

    if (searchTerm?.trim()) {
      query = query.ilike("name", `%${searchTerm.trim()}%`);
    }
}

export const getUniversity = async (searchTerm: string | null) => {
    let query = supabase.from('universities').select('*').order('name', { ascending: true }).limit(50);
    
    handleQuery({query,searchTerm})

    const { data, error } = await query;

    if (error) {
        Alert.alert("University fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.id,
        id:item.id
    })) || [];
}

export const getColleges = async ({ searchTerm, universityId }: { searchTerm?: string | null; universityId: string; }) => {
  let query = supabase.from("colleges").select("*").eq("university_id", universityId).order("name", { ascending: true }).limit(50);

  handleQuery({query,searchTerm})
  const { data, error } = await query;

  if (error) {
    Alert.alert("Colleges fetching error!", error.message);
    return [];
  }

  return (
    data?.map((item) => ({
      label: item.name,
      value: item.id,
      id: item.id,
    })) || []
  );
};

export const getCourses = async ({ searchTerm, collegeId }: { searchTerm?: string, collegeId: string }) => {
    const query = supabase.from('courses').select('*').eq('college_id', collegeId).order('name', { ascending: true }).limit(50);

    handleQuery({query,searchTerm});
    const { data, error } = await query;

    if (error) {
        Alert.alert("Course fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.id,
        id: item.id,
    })) || [];
}

export const getBranches = async ({ searchTerm, courseId }: { searchTerm?: string, courseId: string }) => {
    const query = supabase.from('branches').select('*').eq('course_id', courseId).order('name', { ascending: true }).limit(50);

    handleQuery({query,searchTerm});
    const { data, error } = await query;

    if (error) {
        Alert.alert("Branches fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.id,
        id: item.id,
    })) || [];
}

export const postUniversityOrCollegeOrCourseEtc = async (payload: {
  university_name: string,
  college_name: string,
  course_name: string,
  branch_name: string,
  year: string,
  semester: string,
}) => {
  try {
    const { university_name, college_name, course_name, branch_name, year, semester } = payload;

    // 1. University
    const { data: universityData, error: universityError } = await supabase
      .rpc('find_or_create_university', { p_name: university_name });

    if (universityError || !universityData) throw new Error(universityError?.message || 'Failed to get/create university');

    const university_id = universityData;

    // 2. College
    const { data: collegeData, error: collegeError } = await supabase
      .rpc('find_or_create_college', {
        p_name: college_name,
        p_university_id: university_id,
      });

    if (collegeError || !collegeData) throw new Error(collegeError?.message || 'Failed to get/create college');

    const college_id = collegeData;

    // 3. Course
    const { data: courseData, error: courseError } = await supabase
      .rpc('find_or_create_course', {
        p_name: course_name,
        p_college_id: college_id,
      });

    if (courseError || !courseData) throw new Error(courseError?.message || 'Failed to get/create course');

    const course_id = courseData;

    // 4. Branch
    const { data: branchData, error: branchError } = await supabase
      .rpc('find_or_create_branch', {
        p_name: branch_name,
        p_year: year,
        p_semester: semester,
        p_course_id: course_id,
      });

    if (branchError || !branchData) throw new Error(branchError?.message || 'Failed to get/create branch');

    return {
      university_id,
      college_id,
      course_id,
      branch_id: branchData,
    };
  } catch (err: any) {
    console.error('Error in post university or college or course etc:', err.message);
    return { error: err.message };
  }
};

export const postDocDetails = async (payload: {
    user_id: string,
    title: string,
    description: string,
    document_url: string,
    university_id: string,
    college_id: string,
    course_id: string,
    branch_id: string,
    thumbnail_url?: string
}) => {
    const { data, error } = await supabase.from('doc_details').insert([
        {
            user_id: payload.user_id, // from Supabase Auth
            title: payload.title,
            description: payload.description,
            document_url: payload.document_url,
            thumbnail_url: payload.thumbnail_url,
            university_id: payload.university_id,
            college_id: payload.college_id,
            course_id: payload.course_id,
            branch_id: payload.branch_id,
        },
    ]);

    if (error) {
        Alert.alert("Document posting error!");
        return { status: "error", msg: error.message };
    }
    else
        return { status: "success", msg: data };
}


export const getAllPdf = async () => {
  const { data, error } = await supabase
    .storage
    .from('doc')         // Bucket name
    .list('pdfs', {      // Path (folder) inside the bucket
      limit: 100,        // Max files to return
      sortBy: { column: 'name', order: 'asc' }, // optional
    });
  if (error) {
    console.error('Failed to fetch files', error.message);
    return [];
  }
  let filter = data.map(res => ({name:res.name,id:res.id,created_at:res.created_at}))
  return filter;
};

export const getAllNoteByUserId = async ({ userId }: { userId: string }) => {
    const { data, error } = await supabase
        .from('doc_details')
        .select('*, universities(name), colleges(name), courses(name), branches(name), years(year_number), semesters(semester_number)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) {
        return { status: "error", msg: error.message };
    }
    else
        return { status: "success", data, msg: "success" };

}

export const getFilteredNotes = async ({ university_id, college_id, semester_id }: { userId: string, university_id: string, college_id: string, semester_id: string }) => {
    const { data, error } = await supabase
        .from('doc_details')
        .select('*, universities(name), colleges(name), courses(name), branches(name)')
        .match({
            university_id,
            college_id,
            semester_id,
        })
        .order('created_at', { ascending: false });

    if (error) {
        return { status: "error", msg: error.message };
    }
    else
        return { status: "success", data, msg: "success" };
}
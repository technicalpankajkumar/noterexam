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
    })) || [];
}
export const getSemesters = async (searchTerm: string | null) => {
    let query = supabase.from('semesters').select('*').order('name', { ascending: true });
    
    handleQuery({query,searchTerm})

    const { data, error } = await query;

    if (error) {
        Alert.alert("Semester fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.id,
    })) || [];
}
export const getYears = async (searchTerm: string | null) => {
    let query = supabase.from('years').select('*').order('name', { ascending: true });
    
    handleQuery({query,searchTerm})

    const { data, error } = await query;

    if (error) {
        Alert.alert("Years fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.id,
    })) || [];
}
export const postUniversityOrCollegeOrCourseEtc = async (payload: {
  university_name: string,
  college_name: string,
  course_name: string,
  branch_name: string,
  year_id: string,
  semester_id: string,
}) => {
  try {
    const { university_name, college_name, course_name, branch_name, year_id, semester_id } = payload;

    // 1. University
    const { data: universityData, error: universityError } = await supabase
      .rpc('find_or_create_university', { p_name: university_name });

    if (universityError || !universityData) return ({ error:universityError?.message || 'Failed to get/create university'});

    const university_id = universityData;

    // 2. College
    const { data: collegeData, error: collegeError } = await supabase
      .rpc('find_or_create_college', {
        p_name: college_name,
        p_university_id: university_id,
      });

    if (collegeError || !collegeData) return ({ error:collegeError?.message || 'Failed to get/create college'});

    const college_id = collegeData;

    // 3. Course
    const { data: courseData, error: courseError } = await supabase
      .rpc('find_or_create_course', {
        p_name: course_name,
        p_college_id: college_id,
      });

    if (courseError || !courseData)return ({error: courseError?.message || 'Failed to get/create course'});

    const course_id = courseData;

    // 4. Branch
    const { data: branch_id, error: branchError } = await supabase
      .rpc('find_or_create_branch', {
        p_name: branch_name,
        p_course_id: course_id,
      });

    if (branchError || !branch_id) return ({ error: branchError?.message || 'Failed to get/create branch'});

     const { data:branch_year_semesters_id, error: error } = await supabase
      .rpc('find_or_create_branch_year_semester', {
        p_branch_id: branch_id,
        p_year_id: year_id,
        p_semester_id: semester_id,
      });

    if (error || !branch_year_semesters_id) return ({ error:error?.message || 'Failed to add year/semester to branch'});
    
    return {
      university_id,
      college_id,
      course_id,
      branch_id,
      branch_year_semesters_id
    };
  } catch (err: any) {
    return { error: err.message };
  }
};
export const postDocDetails = async (payload: {
    user_id: string,
    title: string,
    description: string,
    type:'quantum' | 'book' | 'notes'; 
    document_url: string,
    thumbnail_url?: string,
    university_id: string,
    college_id:string,
    course_id: string,
    branch_year_semesters_id:string,
}) => {
     try {
    const { data, error } = await supabase.from('doc_details').insert([
      {
        user_id: payload.user_id,
        title: payload.title,
        description: payload.description,
        document_url: payload.document_url,
        thumbnail_url: payload.thumbnail_url,
        university_id: payload.university_id,
        college_id: payload.college_id,
        course_id: payload.course_id,
        branch_year_semesters_id: payload.branch_year_semesters_id,
        type: payload.type,
      },
    ]).select('id'); // optional: return inserted rows

    if (error) {
      return { status: "error", msg: error.message };
    }
    return { status: "success", msg: data };
  } catch (err: any) {
    // Alert.alert("Unexpected error", err.message || "Something went wrong");
    return { status: "error", msg: err.message || err };
  }
}


export const getAllPdf = async () => {
  const { data, error } = await supabase
    .storage
    .from('file')         // Bucket name
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


// get books details

type FetchDocumentsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  filters?: {
    university_id?: string;
    college_id?: string;
    course_id?: string;
    branch_id?: string;
    year_id?: string;
    semester_id?: string;
    year_number?: number;
    semester_number?: number;
    type?: 'book' | 'notes' | 'quantum' | 'prev_paper' | 'modal_paper'; // from your enum
  };
};

// export const getBooksDetails = async ({
//   page = 1,
//   limit = 10,
//   searchTerm = '',
//   filters = {},
// }: FetchDocumentsParams) => {
//   try {
//     const offset = (page - 1) * limit;

//     let query = supabase
//       .from('doc_details')
//       .select()
//       .order('created_at', { ascending: false })
//       .range(offset, offset + limit - 1);

//     // Apply search
//     if (searchTerm) {
//       query = query.ilike('title', `%${searchTerm}%`);
//     }

//     // Apply filters
//     const {
//       university_id,
//       college_id,
//       course_id,
//       branch_id,
//       type,
//     } = filters;

//     if (university_id) query = query.eq('university_id', university_id);
//     if (college_id) query = query.eq('college_id', college_id);
//     if (course_id) query = query.eq('course_id', course_id);
//     if (branch_id) query = query.eq('branch_id', branch_id);
//     if (type) query = query.eq('type', type);

//     // Join to year/semester tables if needed in future using RPC

//     const { data, error, count } = await query;

//     if (error) {
//       console.error('Fetch error:', error.message);
//       return { success: false, error: error.message };
//     }

//     return {
//       success: true,
//       data,
//       count,
//       page,
//       totalPages: Math.ceil((count || 0) / limit),
//     };
//   } catch (err: any) {
//     return {
//       success: false,
//       error: err?.message || 'Unexpected fetch error',
//     };
//   }
// };

export const getBooksDetails = async ({
  page = 1,
  limit = 10,
  searchTerm = '',
  filters = {},
}: FetchDocumentsParams) => {
  try {
    const offset = (page - 1) * limit;

    const {
      university_id,
      college_id,
      course_id,
      branch_id,
      year_id,
      semester_id,
      type,
    } = filters;

    const { data, error } = await supabase.rpc('fetch_doc_details_with_names', {
      p_university_id: university_id || null,
      p_college_id: college_id || null,
      p_course_id: course_id || null,
      p_branch_id: branch_id || null,
      p_year_id: year_id || null,
      p_semester_id: semester_id || null,
      p_type: type || null,
      p_search_term: searchTerm || null,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      console.error('Supabase fetch error:', error);
      return { success: false, error: error.message };
    }

    const total = data?.[0]?.total_count || 0;

    return {
      success: true,
      data,
      count: total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unexpected fetch error',
    };
  }
};


export const getThumbnailUrl = (path:string) => {
  return supabase
    .storage
    .from('thumbnails')
    .getPublicUrl(path.replace(/^thumbnails\//, '')).data.publicUrl;
};
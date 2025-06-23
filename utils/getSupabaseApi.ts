import { supabase } from "@lib/supabase";
import { Alert } from "react-native";


export const getUniversity = async (searchTerm: string | null) => {
    const { data, error } = await supabase
        .from('universities')
        .select('*')
        // .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(50);

    if (error) {
        Alert.alert("University fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.name,
        id:item.id
    })) || [];
}

export const getColleges = async ({ searchTerm, basedId }: { searchTerm: string | null, basedId: string }) => {
    const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('university_id', basedId)
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(50);

    if (error) {
        Alert.alert("Colleges fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.name,
        id:item.id
    })) || [];
}

export const getCourses = async ({ searchTerm, basedId }: { searchTerm: string, basedId: string }) => {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('college_id', basedId)
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(50);

    if (error) {
        Alert.alert("Course fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.id,
    })) || [];
}

export const getBranches = async ({ searchTerm, basedId }: { searchTerm: string, basedId: string }) => {
    const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('course_id', basedId)
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(50);

    if (error) {
        Alert.alert("Branches fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.id,
    })) || [];
}

export const getYears = async ({ searchTerm, basedId }: { searchTerm: string, basedId: string }) => {
    const { data, error } = await supabase
        .from('years')
        .select('*')
        .eq('branch_id', basedId)
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(50);

    if (error) {
        Alert.alert("Years fetching error!")
    }
    return data?.map((item) => ({
        label: item.name,
        value: item.id,
    })) || [];
}

export const getSemesters = async ({ searchTerm, basedId }: { searchTerm: string, basedId: string }) => {
    const { data, error } = await supabase
        .from('semesters')
        .select('*')
        .eq('year_id', basedId)
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(50);

    if (error) {
        Alert.alert("Semesters fetching error!")
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
    year_number: number,
    semester_number: number,
}) => {

//     const { data, error } = await supabase.rpc('find_or_create_university', {
//   p_name: payload.university_name,
// });

// if (error) {
//   console.error('Error:', error.message);
// } else {
//   console.log('University ID:', data); // UUID of existing or new university
// }

    const { data, error } = await supabase.rpc('get_or_create_full_academic_path', {
            p_university_name: 'AKTU',
            p_college_name: 'PIT',
            p_course_name: 'B.Tech',
            p_branch_name: 'CSE',
            p_year_number: 3,
            p_semester_number: 5
    });

    if (error) {
        console.error(error);
    } else {
        return data;
    }
}

export const postDocumentDetails = async (payload: {
    user_id: string,
    title: string,
    description: string,
    document_url: string,
    university_id: string,
    college_id: string,
    course_id: string,
    branch_id: string,
    year_id: string,
    semester_id: string,
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
            year_id: payload.year_id,
            semester_id: payload.semester_id,
        },
    ]);

    if (error) {
        Alert.alert("Document posting error!");
        return { status: "error", msg: error.message };
    }
    else
        return { status: "success", msg: data };
}



export const getAllNotes = async ({ userId }: { userId: string }) => {
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
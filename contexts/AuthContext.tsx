import { supabase } from '@lib/supabase';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface Profile {
  id: string;
  email: string;
  name: string;
  mobile: string;
  image?: string;
  course?: string;
  branch?: string;
  college?: string;
  university?: string;
  year?: string;
  semester?: string;
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  loginWithEmailPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithMobilePassword: (mobile: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmailPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmailMobilePassword: (data: { email: string; password: string; name: string; mobile: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  uploadProfileImage: (fileUri: string) => Promise<string | null>;
  updateProfile: (profile: Partial<Profile>) => Promise<boolean>;
  resetPasswordWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  verifyEmail: (email: string) => Promise<{ success: boolean; error?: string, msg?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      await fetchProfile(data.session.user.id);
    }
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        mobile,
        profile_image,
        university_id,
        college_id,
        course_id,
        type,
        branch_year_semesters_id,
        branch_year_semesters (
          id,
          branch_id,
          year_id,
          semester_id,
          branches (
            id,
            name
          ),
          years (
            id,
            name
          ),
          semesters (
            id,
            name
          )
        )
      `)
      .eq('id', userId)
      .single();
    if (data) {
      // const { data: branch_year_semester_id, error: branchYearSemesterError } = await supabase
      //   .from('branch_year_semesters')
      //   .select('*')
      //   .eq('id', data.branch_year_semesters_id)
      //   .single();

      setUser(data);
      await SecureStore.setItemAsync('user', JSON.stringify(data));
    } else {
      setUser(null);
      await SecureStore.deleteItemAsync('user');
    }
  };

  // --- AUTH FUNCTIONS ---

  // Login with email and password
  const loginWithEmailPassword = async (email: string, password: string) => {
    try{
      let lowercaseEmail = email.toLowerCase();
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email: lowercaseEmail, password });

      if (error || !data.user) {
        setLoading(false);
        Alert.alert('Error!', error?.message || "Login Failed!")
        return { success: false};
      }
      await fetchProfile(data.user.id);
      setLoading(false);
      return { success: true };
    }catch(err){
       Alert.alert('Network request error!')
    }
  };

  // Login with mobile and password
  const loginWithMobilePassword = async (mobile: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('mobile', mobile)
      .single();
    if (error || !data?.email) {
      setLoading(false);
      return { success: false, error: 'Mobile not found' };
    }
    return await loginWithEmailPassword(data.email, password);
  };

  // Login with magic link
  const loginWithMagicLink = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  // Signup with email and password only
  const signupWithEmailPassword = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error || !data.user) return { success: false, error: error?.message || 'Signup failed' };
    return { success: true };
  };

  // Signup with email, mobile, password, name
  const signupWithEmailMobilePassword = async ({
    email,
    password,
    name,
    mobile,
  }: {
    email: string;
    password: string;
    name: string;
    mobile: string;
  }) => {
    setLoading(true);
    let lowercaseEmail = email.toLowerCase();
    const { data, error } = await supabase.auth.signUp({ email: lowercaseEmail, password });
    if (error || !data.user) {
      setLoading(false);
      return { success: false, error: error?.message || 'Signup failed' };
    }
    // Insert profile data
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: data.user.id, email, name, mobile },
    ]);
    setLoading(false);
    if (profileError) return { success: false, error: profileError.message };
    await fetchProfile(data.user.id);
    return { success: true };
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    await SecureStore.deleteItemAsync('user');
    setLoading(false);
  };

  // Upload profile image
  const uploadProfileImage = async (fileUri: string): Promise<string | null> => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const fileExt = fileUri.split('.').pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, blob, { upsert: true });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
      return publicUrlData?.publicUrl || null;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  // Update profile
  const updateProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
    try {
      if (!user) return false;
      const { data: branch_year_semesters_id, error: error } = await supabase
        .rpc('find_or_create_branch_year_semester', {
          p_branch_id: profileData?.branch,
          p_year_id: profileData?.year,
          p_semester_id: profileData?.semester,
        });

      if (error || !branch_year_semesters_id) throw new Error(error?.message || 'Failed to add year/semester to branch');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: profileData?.name,
          email: profileData?.email,
          mobile: profileData?.mobile,
          university_id: profileData?.university,
          college_id: profileData?.college,
          course_id: profileData?.course,
          branch_year_semesters_id,
        })
        .eq('id', user?.id);
      if (updateError) Alert.alert(updateError.message)
      else alert('Profile updated')
      await fetchProfile(user.id);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  // Reset password via email
  const resetPasswordWithEmail = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  // Refresh profile
  const refreshProfile = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    if (data?.user) await fetchProfile(data.user.id);
    setLoading(false);
  };

  const verifyEmail = async (email: string): Promise<{ success: boolean; error?: string, msg?: string }> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: 'https://your-app.com/verify',
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    // Optionally, you can show an alert here if you want
    // alert('Verification email resent.');
    return { success: true, msg: "Verification email resent." };
  };

  // Provide all functions and user data globally
  const value: AuthContextType = {
    user,
    loading,
    loginWithEmailPassword,
    loginWithMobilePassword,
    loginWithMagicLink,
    signupWithEmailPassword,
    signupWithEmailMobilePassword,
    logout,
    uploadProfileImage,
    updateProfile,
    resetPasswordWithEmail,
    refreshProfile,
    verifyEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
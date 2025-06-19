import { supabase } from '@lib/supabase';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
  course_year?: string;
  // Do not store password in context for security
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signup: (data:{name: string, email: string, password: string,mobile: string}) => Promise<{ success: boolean; error?: string }>;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  verifyEmail?: (code: string) => Promise<boolean>;
  updateProfile: (profile: Partial<Profile>) => Promise<boolean>;
  uploadProfileImage: (fileUri: string) => Promise<string | null>;
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

  // Upload profile image to Supabase Storage
  const uploadProfileImage = async (fileUri: string): Promise<string | null> => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const fileExt = fileUri.split('.').pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, blob, { upsert: true });
      if (error) throw error;
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
      return publicUrlData?.publicUrl || null;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

   // Update profile data in Supabase
  const updateProfile = async (profile: Partial<Profile>): Promise<boolean> => {
    try {
      if (!user) return false;
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);
      if (error) throw error;
      // Refresh user profile
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (fetchError) throw fetchError;
      setUser(data);
      await SecureStore.setItemAsync('user', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) {
      setUser(data);
      await SecureStore.setItemAsync('user', JSON.stringify(data));
    } else {
      setUser(null);
      await SecureStore.deleteItemAsync('user');
    }
  };

  const signup = async ({
    email,
    name,
    password,
    mobile,
    course,
    branch,
    college,
    university,
    course_year,
    image,
  }: {
    email: string;
    name: string;
    password: string;
    mobile: string;
    course?: string;
    branch?: string;
    college?: string;
    university?: string;
    course_year?: string;
    image?: string;
  }) => {
    setLoading(true);
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error || !data.user) {
      setLoading(false);
      return { success: false, error: error?.message || 'Signup failed' };
    }
    // Insert profile data
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: data.user.id,
        email,
        name,
        mobile,
        course,
        branch,
        college,
        university,
        course_year,
        image,
      },
    ]);
    if (profileError) {
      setLoading(false);
      return { success: false, error: profileError.message };
    }
    await fetchProfile(data.user.id);
    setLoading(false);
    return { success: true };
  };

  // Login with email or mobile and password
  const login = async (identifier: string, password: string) => {
    setLoading(true);
    let email = identifier;
    // If identifier is not an email, try to find email by mobile
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('mobile', identifier)
        .single();
      if (error || !data?.email) {
        setLoading(false);
        return { success: false, error: 'Mobile not found' };
      }
      email = data.email;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      setLoading(false);
      return { success: false, error: error?.message || 'Login failed' };
    }
    await fetchProfile(data.user.id);
    setLoading(false);
    return { success: true };
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    await SecureStore.deleteItemAsync('user');
    setLoading(false);
  };

  const refreshProfile = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      await fetchProfile(data.user.id);
    }
    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    loading,
    signup,
    updateProfile,
    uploadProfileImage,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
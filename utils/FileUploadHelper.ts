import { supabase } from '@lib/supabase';
import { Buffer } from 'buffer';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
global.Buffer = global.Buffer || Buffer;

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export const selectFileNoteByDevice = async () => {
  try {
    const doc = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (doc.canceled || !doc.assets || doc.assets.length === 0) {
      Alert.alert('User canceled or no file selected.');
      return;
    }

    
    if (doc.canceled || !doc.assets?.[0]) return;
    
    const fileUri = doc.assets[0].uri;
    const fileName = doc.assets[0].name;
    const path = `pdfs/${fileName}`;

  const response = await fetch(fileUri);
  const fileBlob = await response.blob();

  // Check login
  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    Alert.alert("You must log in first");
    return;
  }
    return {success:true,fileBlob,path,fileName}
  } catch (err) {
    return { success: false, error: err };
  }
};

export const uploadFileServer= async({path,fileBlog}:{path:string,fileBlog:string})=>{
  const { data, error } = await supabase.storage
      .from('file')
      .upload(path, fileBlog, {
        contentType: 'application/pdf',
        upsert: true,
      });
    if (error) {
      return { success: false, error };
    }
    return { success: true, data };
}

export const selectImageByDevice = async ()=> {
  try {
    // Ask for media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return { error: 'Permission denied' };

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) {
      return { error: 'Image selection cancelled' };
    }

    const image = result.assets[0];

    // Extract extension
    const fileExt = image.uri.split('.').pop()?.toLowerCase();

    // Validate extension
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      return { error: 'Only JPG, JPEG, and PNG files are allowed' };
    }

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(image.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `images/${fileName}`;
    const contentType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

    return {fileName,filePath,contentType,base64};

  } catch (err: any) {
    return { error: err.message || 'Upload failed' };
  }
};

export const uploadImageServer= async({filePath,base64,contentType}:{filePath:string,base64:string,contentType:string})=>{
  // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, Buffer.from(base64, 'base64'), {
        contentType,
        upsert: true,
      });

    if (error) {
      return { success: false, error };
    }
    return { success: true, data };
}



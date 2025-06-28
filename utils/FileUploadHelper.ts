import { supabase } from '@lib/supabase';
import { Buffer } from 'buffer';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
global.Buffer = global.Buffer || Buffer;

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export const selectFileNoteByDevice = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('User canceled or no file selected.');
      return;
    }

    const file = result.assets[0];
    const fileUri = file.uri;

    const fileName = `${file.name}`;
    const path = `pdfs/${fileName}`;

    const base64Data = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileBuffer = Buffer.from(base64Data, 'base64');
    return {success:true,fileBuffer,path,fileName}
  } catch (err) {
    return { success: false, error: err };
  }
};

export const uploadFileServer= async({path,fileBuffer}:{path:string,fileBuffer:Buffer})=>{
  const { data, error } = await supabase.storage
      .from('doc') // Replace 'doc' with your actual bucket name
      .upload(path, fileBuffer, {
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
      .from('profile-images')
      .upload(filePath, Buffer.from(base64, 'base64'), {
        contentType,
        upsert: true,
      });

    if (error) {
      return { success: false, error };
    }
    return { success: true, data };
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


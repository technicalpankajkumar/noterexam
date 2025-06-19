import { supabase } from '@lib/supabase';
import { Buffer } from 'buffer';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
global.Buffer = global.Buffer || Buffer;

export const uploadPDF = async () => {
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

    const { data, error } = await supabase.storage
      .from('doc') // Replace 'doc' with your actual bucket name
      .upload(path, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });
    if (error) {
      console.error('Upload error:', error);
      return { success: false, error };
    }

    console.log('Upload successful:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error during upload:', err);
    return { success: false, error: err };
  }
};

// export const uploadImage = async () => {
//   const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });

//   if (!result.canceled && result.assets?.length > 0) {
//     const file = result.assets[0];
//     const fileData = await FileSystem.readAsStringAsync(file.uri, {
//       encoding: FileSystem.EncodingType.Base64,
//     });

//     const path = `images/${Date.now()}.jpg`;
//     return supabase.storage.from('profile-images').upload(path, Buffer.from(fileData, 'base64'), {
//       contentType: 'image/jpeg',
//       upsert: true,
//     });
//   }
// };


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


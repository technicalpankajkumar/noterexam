import { supabase } from '@lib/supabase';
import { Buffer } from 'buffer';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
global.Buffer = global.Buffer || Buffer;

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

type UploadFileResponse = {
  success: boolean;
  data?: any;
  error?: string;
  exists?: boolean;
  fileUrl?: string;
};

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
    return { success: true, fileBuffer, path, fileName }
  } catch (err) {
    return { success: false, error: err };
  }
};

export const uploadFileServer = async ({
  path,
  fileBuffer,
  isPublic = true,
}: {
  path: string;
  fileBuffer: Buffer;
  isPublic?: boolean;
}): Promise<UploadFileResponse> => {
  try {
    const exists = await checkFileExists(path, 'file');

    if (exists) {
      const fileUrl = await getOnlineUrl(path, isPublic, 'file');
      return {
        success: true,
        exists: true,
        fileUrl: fileUrl ?? undefined,
      };
    }

    const { data, error } = await supabase.storage
      .from('file')
      .upload(path, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false, // don't overwrite
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unexpected error during upload.',
    };
  }
};

export const selectImageByDevice = async () => {
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

    return { fileName, filePath, contentType, base64 };

  } catch (err: any) {
    return { error: err.message || 'Upload failed' };
  }
};

export const uploadImageServer = async ({ filePath, base64, contentType }: { filePath: string, base64: string, contentType: string }) => {
  // Upload to Supabase
  try {
    const exists = await checkFileExists(filePath, 'thumbnails');
    if (exists) {
      const fileUrl = await getOnlineUrl(filePath, true, 'thumbnails');
      return {
        success: true,
        exists: true,
        fileUrl: fileUrl ?? undefined,
      };
    }

    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, Buffer.from(base64, 'base64'), {
        contentType,
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }
    const fileUrl = await getOnlineUrl(filePath, true, 'thumbnails');

    return {
      success: true,
      data,
      fileUrl: fileUrl ?? undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unexpected error during upload.',
    };
  }
}

const checkFileExists = async (path: string, directory: string): Promise<boolean> => {
  const folder = path.split('/').slice(0, -1).join('/');
  const filename = path.split('/').pop();
  const { data } = await supabase.storage.from(directory).list(folder);
  return data?.some((file) => file.name === filename) ?? false;
};


export const getOnlineUrl = (path: string, isPublic = true, directory: string): Promise<string | null> => {
  if (isPublic) {
    return Promise.resolve(
      supabase.storage.from(directory).getPublicUrl(path).data.publicUrl
    );
  } else {
    return supabase.storage
      .from(directory)
      .createSignedUrl(path, 60 * 60)
      .then(({ data, error }) => (error ? null : data.signedUrl));
  }
};

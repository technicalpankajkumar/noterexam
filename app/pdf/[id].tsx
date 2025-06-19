import PDFViewer from '@components/custom-ui/PdfViewer';
import { supabase } from '@lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

const PdfById=()=> {
  const { id } = useLocalSearchParams();
  const [url,setUrl] = useState<string>('')

const getPdfUrlByName = async (name: string) => {
  const { data, error } = await supabase
    .storage
    .from('doc')
    .createSignedUrl(`pdfs/${id}`, 3600); // 1 hour URL

  if (error) {
    console.error('Failed to get signed URL:', error.message);
    return null;
  }

  return data?.signedUrl;
};

const fetchPdfUrl = async () => {
  let url = await getPdfUrlByName(id);
  setUrl(url);
};
useEffect(() => {
  fetchPdfUrl();
}, []);

  return (
    <View className="flex-1 bg-white">
      <PDFViewer uri={url} />
    </View>
  );
}


export default PdfById
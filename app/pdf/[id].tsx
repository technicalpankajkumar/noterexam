import PDFViewer from '@components/custom-ui/PdfViewer';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getOnlineUrl } from '../../utils/FileUploadHelper';

const PdfById = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string | null>(null);

  const getPdfUrlByName = async () => {
     return await getOnlineUrl(`pdfs/${params.id}`, false, 'file');
  };

  const fetchPdfUrl = async () => {
    setLoading(true);
    let url = await getPdfUrlByName();
    setLoading(false);
    setUrl(url);
  };
  useEffect(() => {
    fetchPdfUrl();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <PDFViewer uri={url} loading={loading} />
    </View>
  );
}


export default PdfById
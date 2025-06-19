import PDFReader from '@components/custom-ui/PdfViewer';
import { supabase } from '@lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';

export default function ViewPDF() {
  const { name } = useLocalSearchParams(); // expects param 'name'
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    const fetchPDF = async () => {
      const { data, error } = await supabase
        .storage
        .from('doc')
        .createSignedUrl(`pdfs/${name}`, 60 * 60); // 1 hour

      if (data?.signedUrl) setPdfUrl(data.signedUrl);
      else console.error(error);
    };

    fetchPDF();
  }, [name]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {pdfUrl ? <PDFReader url={pdfUrl} /> : <ActivityIndicator size="large" />}
    </SafeAreaView>
  );
}

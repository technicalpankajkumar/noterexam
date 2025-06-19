import PDFViewer from '@components/custom-ui/PdfViewer';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function ViewPDFScreen() {
  const { id } = useLocalSearchParams();

  // Here you'd fetch the PDF URL from your API using the ID
  const pdfUrl = `'https://hjvoutpgcveoxwoextvq.supabase.co/storage/v1/object/sign/doc/WEB%20TECHNOLOGY%20Season%202024-2025.pdf%20quanttt%20(1)_compressed_compressed.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNjg4NDlkNS1kMTVlLTQ3YjItODE0OC0zMzVjNWNiMjEyZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb2MvV0VCIFRFQ0hOT0xPR1kgU2Vhc29uIDIwMjQtMjAyNS5wZGYgcXVhbnR0dCAoMSlfY29tcHJlc3NlZF9jb21wcmVzc2VkLnBkZiIsImlhdCI6MTc1MDMwODc3MCwiZXhwIjoxNzgxODQ0NzcwfQ.RQoQDx_j9-lAg9hb0sQtHrFOfMbFbKhKRhXl_vFhuM0'`;

  return (
    <View className="flex-1 bg-white">
      <PDFViewer uri={pdfUrl} />
    </View>
  );
}

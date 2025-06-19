import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Pdf from 'react-native-pdf';

// export default function PDFViewer() {
//   const source = {
//     uri: 'https://hjvoutpgcveoxwoextvq.supabase.co/storage/v1/object/sign/doc/WEB%20TECHNOLOGY%20Season%202024-2025.pdf%20quanttt%20(1)_compressed_compressed.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNjg4NDlkNS1kMTVlLTQ3YjItODE0OC0zMzVjNWNiMjEyZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb2MvV0VCIFRFQ0hOT0xPR1kgU2Vhc29uIDIwMjQtMjAyNS5wZGYgcXVhbnR0dCAoMSlfY29tcHJlc3NlZF9jb21wcmVzc2VkLnBkZiIsImlhdCI6MTc1MDMwODc3MCwiZXhwIjoxNzgxODQ0NzcwfQ.RQoQDx_j9-lAg9hb0sQtHrFOfMbFbKhKRhXl_vFhuM0',
//     cache: true,
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Pdf
//         source={source}
//         onLoadComplete={(numberOfPages) => {
//           console.log(`Number of pages: ${numberOfPages}`);
//         }}
//         onPageChanged={(page, numberOfPages) => {
//           console.log(`Current page: ${page}`);
//         }}
//         onError={(error) => {
//           console.log(error);
//         }}
//         style={{ flex: 1, width: Dimensions.get('window').width }}
//       />
//     </View>
//   );
// }



export default function PDFViewer({ uri }: { uri: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <View className="flex-1">
      {loading && <ActivityIndicator className="mt-4" size="large" color="#4A90E2" />}
      <Pdf
        source={{ uri }}
        onLoadComplete={() => setLoading(false)}
        style={{ flex: 1 }}
      />
    </View>
  );
}


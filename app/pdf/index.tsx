import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { getAllPdf } from '../../utils/FileUploadHelper';

export default function PDFList() {
  const [files, setFiles] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    let data = getAllPdf();
    setFiles(data?.map((file) => file.name));
  }, []);

  const handlePress = (fileName: string) => {
    router.push({ pathname: '/pdf/pdf', params: { name: fileName } });
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>PDF Files</Text>
      <FlatList
        data={files}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={{ paddingVertical: 12 }}>
            <Text style={{ fontSize: 18 }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

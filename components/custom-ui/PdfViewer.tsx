import React, { useState } from 'react';
import { View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function PDFViewer({ uri }: { uri: string }) {
    const [loading, setLoading] = useState(true);

    return (
        <View className="flex-1">
            {/* {loading && <ActivityIndicator className="mt-4" size="large" color="#4A90E2" />} */}
            <Pdf
                source={{ uri }}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={{}} />
            {/* <WebView
        source={{ uri: uri.toString() }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" />}
        originWhitelist={['*']}
        javaScriptEnabled
        allowsFullscreenVideo={false}
        allowsBackForwardNavigationGestures
      /> */}
        </View>
    );
}
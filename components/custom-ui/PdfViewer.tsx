import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import WebView from "react-native-webview";
export default function PDFViewer({ uri }: { uri: string }) {
    const [loading, setLoading] = useState(true);

    return (
        <View className="flex-1">
            {/* {loading && <ActivityIndicator className="mt-4" size="large" color="#4A90E2" />} */}
            {/* <Pdf
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
                style={{}} /> */}
            <WebView
        source={{ uri: "https://www.furlenco.com/?srsltid=AfmBOoqktYZ_ZqbqYXOlFAdSEbDecB0VmOlrXWjKAzS3AWEN0LW8rPQv" }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" />}
        originWhitelist={['*']}
        javaScriptEnabled
        allowsFullscreenVideo={false}
        allowsBackForwardNavigationGestures
      />
        </View>
    );
}
import { router } from 'expo-router';
import { Bell, FileText, Home, User, Users } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
export default function PDFViewer({ uri, loading }: { uri: string, loading?: boolean }) {

    const pdfjsViewer = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(uri)}`;

    return (
        <View className="flex-1 bg-gray-100 pt-4">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Header */}
            <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-end items-center px-2 pt-2 bg-gray-50 h-4"></View>
            <View className="absolute top-0 right-0 z-10 flex-row justify-end items-center px-2 pt-2 bg-gray-50">
                <View className="flex-row space-x-3">
                    <TouchableOpacity className="pt-4 px-2">
                        <Bell size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
            {loading ? <ActivityIndicator /> : <WebView
                className='mb-16'
                source={{ uri: pdfjsViewer }}
                originWhitelist={[]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                allowsBackForwardNavigationGestures={false}
                allowFileAccess={true}
                pagingEnabled
                onNavigationStateChange={(navState) => {
                    if (navState.url !== pdfjsViewer) {
                        navState.url = pdfjsViewer;
                    }
                }}
            />}
            <View className="absolute bottom-0 left-0 right-0 z-10 py-2 flex-row justify-between items-center px-6 pt-2 pb-2 bg-[#f8fafc] border-t border-[#e5e7eb]">
                <TouchableOpacity className='flex items-center' onPress={() => router.push('/(tabs)')}>
                    <Home size={24} color={'gray'} />
                    <Text className='text-gray-500 font-medium text-sm'>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex items-center' onPress={() => router.push('/(tabs)/notes')}>
                    <FileText size={24} color={'#4A90E2'} />
                    <Text className='text-[#4A90E2] font-medium text-sm'>Notes</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex items-center' onPress={() => router.push('/(tabs)/community')}>
                    <Users size={24} color={'gray'} />
                    <Text className='text-gray-500 font-medium text-sm'>News</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex items-center' onPress={() => router.push('/(tabs)/profile')}>
                    <User size={24} color={'gray'} />
                    <Text className='text-gray-500 font-medium text-sm'>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
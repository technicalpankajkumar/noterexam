import { supabase } from '@lib/supabase';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getTokenFromURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const parsed = Linking.parse(initialUrl);
        const tokenFromUrl = parsed.queryParams?.access_token;
        if (typeof tokenFromUrl === 'string') {
          setToken(tokenFromUrl);
        }
      }
    };
    getTokenFromURL();
  }, []);

  const handleReset = async () => {
    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully!');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Enter your new password:</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="New Password"
        style={{ marginVertical: 10, borderBottomWidth: 1 }}
      />
      <Button title="Reset Password" onPress={handleReset} disabled={!token} />
      {message ? <Text style={{ marginTop: 10 }}>{message}</Text> : null}
    </View>
  );
}

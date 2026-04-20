import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    if (isLogin) {
      const { error: err } = await signIn(email.trim(), password);
      if (err) setError(err);
    } else {
      const { error: err } = await signUp(email.trim(), password);
      if (err) {
        setError(err);
      } else {
        setSignUpSuccess(true);
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        {/* Logo */}
        <Text style={styles.logo}>ModCheck</Text>
        <Text style={styles.tagline}>Car Mod Legality Checker</Text>

        {signUpSuccess ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Check your email!</Text>
            <Text style={styles.successText}>
              We sent a confirmation link to {email}. Click it to activate your account, then sign in.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                setSignUpSuccess(false);
                setIsLogin(true);
              }}
            >
              <Text style={styles.primaryButtonText}>Back to Sign In</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Form */}
            <Text style={styles.formTitle}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#555"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#555"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0f0f0f" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
            >
              <Text style={styles.switchText}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign In'}
              </Text>
            </Pressable>
          </>
        )}

        {/* Guest mode */}
        <Pressable style={styles.guestButton} onPress={continueAsGuest}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </Pressable>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          ModCheck provides general information about vehicle modification laws
          for educational purposes only. This app does not constitute legal
          advice.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 40,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#f87171',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#4ade80',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f0f0f',
  },
  switchText: {
    fontSize: 14,
    color: '#4ade80',
    textAlign: 'center',
  },
  successBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 22,
    marginBottom: 16,
  },
  guestButton: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestText: {
    fontSize: 14,
    color: '#888888',
    textDecorationLine: 'underline',
  },
  disclaimer: {
    fontSize: 10,
    color: '#444444',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 15,
  },
});

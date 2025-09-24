import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/axios';
import { setToken } from '@/storage/token';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Easing, Notifier } from 'react-native-notifier';

import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const bannerHeight = useMemo(() => new Animated.Value(1), []);
  const bannerOpacity = useMemo(() => new Animated.Value(1), []);
  const appNamePadding = useMemo(() => new Animated.Value(40), []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.parallel([
        Animated.timing(bannerHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(bannerOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(appNamePadding, {
          toValue: 20,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.parallel([
        Animated.timing(bannerHeight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(bannerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(appNamePadding, {
          toValue: 40,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [bannerHeight, bannerOpacity, appNamePadding]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });

      await setToken(data.results.token);
      Notifier.showNotification({
        title: 'Login realizado com sucesso!',
        description: 'Você está sendo redirecionado para a home.',
        duration: 0,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        hideOnPress: false,
      });

      router.replace('/(tabs)');

    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" backgroundColor={colors.tint} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Banner */}
          <Animated.View style={[
            styles.banner,
            {
              backgroundColor: colors.tint,
              height: bannerHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200], // Altura máxima do banner
              }),
              opacity: bannerOpacity,
            }
          ]}>
            <Text style={styles.bannerText}>Bem-vindo de volta!</Text>
          </Animated.View>

          {/* Nome do App */}
          <Animated.View style={[
            styles.appNameContainer,
            {
              paddingVertical: appNamePadding,
            }
          ]}>
            <Text style={[styles.appTitle, { color: colors.text }]}>Meu App</Text>
          </Animated.View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: '#FF3B30' }]}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email"
              placeholder="Digite seu email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              variant="default"
              size="large"
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              variant="default"
              size="large"
            />

            {/* Botões */}
            <Button
              title="Entrar"
              onPress={handleLogin}
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

            <Button
              title="Criar Conta"
              onPress={handleRegister}
              variant="outline"
              size="large"
              style={styles.registerButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  banner: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  appNameContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 24,
  },
  registerButton: {
    marginTop: 16,
  },
});

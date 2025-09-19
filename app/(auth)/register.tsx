import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/axios';
import { setToken } from '@/storage/token';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Função para aplicar máscara de telefone brasileiro
  const formatPhoneNumber = (text: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = text.replace(/\D/g, '');
    
    // Aplica a máscara baseada no tamanho
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else {
      // Limita a 11 dígitos
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const handleRegister = async () => {
    const { data } = await api.post('/auth/register', { name, email, phone, password, confirmPassword });

    if (data.error) {
      setError(data.message[0]);
    } else {
      await setToken(data.results.token);
      router.replace('/(tabs)');
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Nome do App */}
          <View style={styles.appNameContainer}>
            <Text style={[styles.appTitle, { color: colors.text }]}>Meu App</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: '#FF3B30' }]}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Nome"
              placeholder="Digite seu nome completo"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (error) setError('');
              }}
              autoCapitalize="words"
              autoCorrect={false}
              variant="default"
              size="large"
            />

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
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={phone}
              onChangeText={(text) => {
                handlePhoneChange(text);
                if (error) setError('');
              }}
              keyboardType="phone-pad"
              maxLength={15}
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

            <Input
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
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
              title="Criar Conta"
              onPress={handleRegister}
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
            />

            <Button
              title="Já tenho uma conta"
              onPress={handleBackToLogin}
              variant="outline"
              size="large"
              style={styles.loginButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  registerButton: {
    marginTop: 24,
  },
  loginButton: {
    marginTop: 16,
  },
});

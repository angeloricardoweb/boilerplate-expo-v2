import { Redirect } from 'expo-router';

export default function AuthIndex() {
  // Por padrão, redireciona para a tela de login
  return <Redirect href="/(auth)/login" />;
}

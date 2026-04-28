import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button.native';
import { Input } from '@/components/ui/Input.native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  scrollView: {
    width: '100%',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabActive: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#fff',
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orDivider: {
    marginVertical: 20,
    alignItems: 'center',
  },
  orText: {
    color: '#999',
    fontSize: 12,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  switchText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    color: '#666',
  },
  switchLink: {
    color: '#000',
    fontWeight: '600',
  },
});

export default function Login({ navigation }) {
  const { loginWithEmail, loginWithGoogle, registerWithEmail } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(form.email, form.password);
      } else {
        if (!form.name) {
          Alert.alert('Erro', 'Por favor, insira seu nome');
          setLoading(false);
          return;
        }
        await registerWithEmail(form.email, form.password, form.name);
      }
      // Navigation will be handled by AuthContext
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // Navigation will be handled by AuthContext
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>CF</Text>
          </View>
          <Text style={styles.title}>CloudFlow</Text>
          <Text style={styles.subtitle}>Aplicação de Ocupação Campus</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, mode === 'login' && styles.tabActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                Entrar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'register' && styles.tabActive]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                Registar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {mode === 'register' && (
              <>
                <Text style={styles.label}>Nome completo</Text>
                <Input
                  placeholder="João Silva"
                  value={form.name}
                  onChangeText={(name) => setForm({ ...form, name })}
                  editable={!loading}
                />
              </>
            )}

            <Text style={styles.label}>Email</Text>
            <Input
              placeholder="seu@email.com"
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <Text style={styles.label}>Palavra-passe</Text>
            <Input
              placeholder="••••••••"
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
              secureTextEntry={true}
              editable={!loading}
            />

            <Button
              variant="primary"
              onPress={handleSubmit}
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Registar'}
            </Button>
          </View>

          {/* Divider */}
          <View style={styles.orDivider}>
            <Text style={styles.orText}>ou</Text>
          </View>

          {/* Google Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogle}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.googleButtonText}>Entrar com Google</Text>
            )}
          </TouchableOpacity>

          {/* Switch Mode */}
          <Text style={styles.switchText}>
            {mode === 'login' ? 'Não tens conta? ' : 'Já tens conta? '}
            <Text
              style={styles.switchLink}
              onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Registar' : 'Entrar'}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

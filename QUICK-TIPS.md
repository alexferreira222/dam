# 💡 React Native - Dicas Rápidas & Cheat Sheet

## 🎯 Comands Mais Usados

```bash
# Iniciar e testar
npm start                    # Inicia Expo dev server
npm run ios                 # Abre iOS Simulator
npm run android             # Abre Android Emulator
npm run web                 # Testa versão web

# Limpeza
npm start -- --reset-cache  # Limpa cache Babel
rm -rf node_modules && npm install  # Reinstala tudo
```

---

## 🎨 Componentes UI - Como Usar

### Button
```javascript
import { Button } from '@/components/ui/Button.native';

<Button variant="primary" onPress={() => console.log('clicked')}>
  Clique aqui
</Button>

// Variantes: primary, secondary, destructive, outline
```

### Input
```javascript
import { Input } from '@/components/ui/Input.native';

<Input
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  secureTextEntry={false}
/>
```

### Card
```javascript
import { Card } from '@/components/ui/Card.native';

<Card>
  <Text>Conteúdo dentro do cartão</Text>
</Card>
```

### Alert
```javascript
import { Alert } from '@/components/ui/Alert.native';

<Alert
  variant="destructive"
  title="Erro!"
  description="Algo correu mal"
/>
```

### Label
```javascript
import { Label } from '@/components/ui/Label.native';

<Label>Meu Rótulo</Label>
```

---

## 🗂️ Estrutura de Ficheiros

### Criar um Novo Componente

**src/components/MyComponent.native.jsx**
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});

export function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Olá!</Text>
    </View>
  );
}
```

### Criar uma Nova Página

**src/pages/MyPage.native.jsx**
```javascript
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
});

export default function MyPage({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text>Conteúdo aqui</Text>
      </ScrollView>
    </View>
  );
}
```

---

## 🔀 Web vs React Native - Conversão Rápida

### Elementos HTML → React Native
```javascript
// ❌ Web
<div>Conteúdo</div>
<p>Parágrafo</p>
<span>Texto</span>
<input type="text" />
<button>Clique</button>
<img src="image.png" />

// ✅ React Native
<View>Conteúdo</View>
<Text>Parágrafo</Text>
<Text>Texto</Text>
<TextInput />
<TouchableOpacity><Text>Clique</Text></TouchableOpacity>
<Image source={require('image.png')} />
```

### Eventos
```javascript
// ❌ Web
onClick={() => {}}
onChange={(e) => console.log(e.target.value)}
onSubmit={(e) => e.preventDefault()}

// ✅ React Native
onPress={() => {}}
onChangeText={(text) => console.log(text)}
// (não existe preventDefault em React Native)
```

### Estilos
```javascript
// ❌ Web
className="flex items-center justify-center p-4 text-lg text-gray-600"

// ✅ React Native
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  text: {
    fontSize: 18,
    color: '#4b5563',
  },
});

// Usar:
<View style={styles.container}>
  <Text style={styles.text}>Texto</Text>
</View>
```

---

## 📱 Tamanhos e Unidades

```javascript
const styles = StyleSheet.create({
  // Dimensões
  container: {
    width: 100,           // 100px
    height: 50,           // 50px
    widthPercent: '50%',  // 50% (string)
  },
  
  // Padding/Margin
  box: {
    padding: 16,          // Todos os lados
    paddingHorizontal: 8, // Esquerda + Direita
    paddingVertical: 12,  // Cima + Baixo
    paddingTop: 4,
    paddingRight: 8,
    paddingBottom: 4,
    paddingLeft: 8,
    
    margin: 16,
    marginHorizontal: 8,
    marginVertical: 12,
  },
  
  // Cores
  text: {
    color: '#000000',     // Hex
    backgroundColor: '#ffffff',
  },
  
  // Texto
  title: {
    fontSize: 24,
    fontWeight: '700',    // '100' a '900'
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  
  // Layout
  flex: {
    flex: 1,              // Ocupa todo espaço
    flexDirection: 'row', // 'row' ou 'column'
    alignItems: 'center', // Alinha no eixo cruzado
    justifyContent: 'space-between', // Alinha no eixo principal
  },
  
  // Borders
  border: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderTopLeftRadius: 8,
  },
  
  // Shadows (iOS)
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  // Elevation (Android)
  elevation: {
    elevation: 3,
  },
});
```

---

## 🧭 Navegação Básica

### Navegar para Outra Tela
```javascript
navigation.navigate('NomeDaTela');
navigation.navigate('NomeDaTela', { id: 123 });  // Com parâmetros
navigation.goBack();  // Voltar
navigation.replace('LoginScreen');  // Substitui a atual
```

### Receber Parâmetros
```javascript
export default function MyScreen({ route }) {
  const { id } = route.params;
  return <Text>{id}</Text>;
}
```

### Programmatic Navigation
```javascript
import { useNavigation } from '@react-navigation/native';

export default function MyComponent() {
  const navigation = useNavigation();
  
  return (
    <Button
      onPress={() => navigation.navigate('Details')}
    >
      Ir para Detalhes
    </Button>
  );
}
```

---

## 🔥 Firebase Básico

### Autenticação
```javascript
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// Login
await signInWithEmailAndPassword(auth, email, password);

// Registar
await createUserWithEmailAndPassword(auth, email, password);

// Logout
await signOut(auth);
```

### Firestore
```javascript
import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';

// Ler todos os documentos
const querySnapshot = await getDocs(collection(db, 'users'));
querySnapshot.forEach((doc) => {
  console.log(doc.id, doc.data());
});

// Ler um documento
const docSnap = await getDoc(doc(db, 'users', 'userId'));
console.log(docSnap.data());

// Escrever/Atualizar
await setDoc(doc(db, 'users', 'userId'), { name: 'João' });
```

---

## 🎯 Form Handling com React Hook Form

```javascript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export default function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Button onPress={handleSubmit(onSubmit)}>
        Entrar
      </Button>
    </View>
  );
}
```

---

## 🎨 Cores e Temas

### Cores Padrão (System)
```javascript
export const colors = {
  // Escala Cinzenta
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Status
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};
```

### Dark Mode (Estrutura)
```javascript
import { useColorScheme } from 'react-native';

export default function MyComponent() {
  const colorScheme = useColorScheme(); // 'light' ou 'dark'
  
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  
  return <Text style={{ color: textColor }}>Texto</Text>;
}
```

---

## 🐛 Debug Comum

### Ver Logs
```javascript
console.log('Mensagem');
console.warn('Aviso');
console.error('Erro');
```

### Alert Rápido
```javascript
import { Alert } from 'react-native';

Alert.alert('Título', 'Mensagem', [
  { text: 'Cancelar', style: 'cancel' },
  { text: 'OK', onPress: () => {} },
]);
```

### React Native Debugger
```bash
# Abrir React Native Debugger (deve estar instalado)
# Shake device (real) ou Ctrl+M (Android) para abrir menu
# Selecionar "Debug JS Remotely"
```

---

## 📦 Instalar Novo Pacote

```bash
# Adicionar dependência
npm install react-native-maps

# Ou com Expo
npx expo install react-native-maps
```

---

## ✨ Performance Tips

1. **Use FlatList em vez de map()**
   ```javascript
   // ❌ Lento
   {items.map(item => <Card key={item.id} />)}
   
   // ✅ Rápido
   <FlatList
     data={items}
     renderItem={({ item }) => <Card />}
     keyExtractor={(item) => item.id}
   />
   ```

2. **Use useMemo para cálculos pesados**
   ```javascript
   import { useMemo } from 'react';
   
   const expensiveValue = useMemo(() => {
     return items.filter(...).sort(...);
   }, [items]);
   ```

3. **Use useCallback para functions**
   ```javascript
   import { useCallback } from 'react';
   
   const handlePress = useCallback(() => {
     // logic here
   }, [dependencies]);
   ```

4. **Lazy load imagens**
   ```javascript
   <Image
     source={{ uri: 'https://example.com/image.png' }}
     onLoadStart={() => setLoading(true)}
     onLoadEnd={() => setLoading(false)}
   />
   ```

---

## 📚 Atalhos de Teclado (Simulator/Emulator)

### iOS Simulator
- `Cmd + D` - Developer Menu
- `Cmd + R` - Reload
- `Cmd + T` - Toggle Touch Hinting

### Android Emulator
- `Ctrl + M` - Developer Menu
- `R + R` - Reload
- `I` - Install App

---

## 🚀 Deploy Rápido (EAS)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios

# Submeter à App Store
eas submit --platform ios

# Submeter ao Google Play
eas submit --platform android
```

---

## 📞 Quick Help

**Problema:** Componente não aparece  
**Solução:** Verifique se está dentro de uma `<View>` e tem width/height ou flex

**Problema:** Estilos aplicados mas não veem  
**Solução:** Use `StyleSheet.create()` e recarregue (`r` no terminal)

**Problema:** Firebase não funciona  
**Solução:** Verifique `.env.local` e credenciais

**Problema:** Navegação não funciona  
**Solução:** Certifique-se que a rota existe no RootNavigator

---

**Bookmark esta página para referência rápida!** 📌

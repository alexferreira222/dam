# CloudFlow - React Native Setup & Installation Guide

## 🎯 Objetivo Completado

Seu projecto CloudFlow foi **totalmente transformado em uma aplicação React Native** usando Expo. Agora pode ser executado em iOS, Android e Web!

---

## 📋 O Que Foi Criado

### 1. **Ficheiros de Configuração**
- ✅ `app.json` - Configuração da aplicação Expo
- ✅ `babel.config.js` - Babel com suporte NativeWind
- ✅ `index.js` - Ponto de entrada Expo
- ✅ `package-native.json` - Dependências React Native

### 2. **Sistema de Navegação**
- ✅ `src/navigation/RootNavigator.jsx` - Navegação completa com autenticação
  - Stack Navigator para cada secção
  - Bottom Tab Navigator para menu
  - Rotas protegidas por autenticação

### 3. **Componentes UI (React Native)**
```
src/components/ui/
├── Button.native.jsx         - Botões com variantes
├── Input.native.jsx          - Campos de texto
├── Card.native.jsx           - Cartões
├── Label.native.jsx          - Rótulos
├── Alert.native.jsx          - Alertas visuais
├── Toast.native.jsx          - Notificações
├── Separator.native.jsx      - Separadores
└── ToggleGroup.native.jsx    - Grupos de alternância
```

### 4. **Páginas Convertidas** (React Native)
```
src/firebase-export/
├── Login.native.jsx          - Autenticação
├── Dashboard.native.jsx      - Página inicial
├── Perfil.native.jsx         - Perfil do utilizador
├── Favoritos.native.jsx      - Favoritos
├── Ranking.native.jsx        - Ranking
├── VenueDetail.native.jsx    - Detalhes do local
└── Admin.native.jsx          - Painel admin
```

### 5. **App Principal**
- ✅ `src/App.jsx` - Actualizado para React Native

### 6. **Documentação**
- ✅ `README-REACT-NATIVE.md` - Guia rápido
- ✅ `REACT-NATIVE-GUIDE.md` - Guia completo
- ✅ `MIGRATION-COMPARISON.md` - Comparação Web vs Native
- ✅ `.gitignore-native` - Ficheiro ignore para React Native

---

## 🚀 Como Começar (3 Passos)

### **Passo 1: Preparar o Package.json**

```bash
# Opção A: Substituir o package.json (recomendado para começar)
cp package.json package-web.json      # Guardar cópia da web
cp package-native.json package.json   # Usar o do React Native

# Opção B: Mesclar dependências manualmente
# (copiar todas as dependências de package-native.json para package.json)
```

### **Passo 2: Instalar Dependências**

```bash
npm install
# ou
npm ci  # Se preferir usar package-lock.json
```

### **Passo 3: Executar**

```bash
# Iniciar o servidor Expo
npm start

# Em outro terminal, escolha uma opção:
npm run ios        # iOS (macOS only)
npm run android    # Android
npm run web        # Web (PWA)
```

---

## 📱 Executar em Simuladores/Emuladores

### **iOS (macOS)**
```bash
npm run ios
# Abre automaticamente no Simulador iOS
```

### **Android**
```bash
# Certifique-se que tem Android Studio + emulador configurado
npm run android
```

### **Dispositivo Real**

1. **Instale Expo Go:**
   - [iOS App Store](https://apps.apple.com/app/expo-go/id1175649075)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Escanear QR Code:**
   ```bash
   npm start
   # Escaneia o QR code com a câmara (iOS) ou Expo Go (Android)
   ```

---

## 🏗️ Estrutura do Projecto

```
CloudFlow/
├── index.js                          ← Novo: Ponto de entrada
├── app.json                          ← Novo: Config Expo
├── babel.config.js                   ← Novo: Babel config
├── package-native.json               ← Novo: Dependências mobile
├── package-web.json                  ← Cópia do package.json original
│
├── src/
│   ├── App.jsx                       ✏️ Actualizado
│   ├── main.jsx                      ← Só para web (ignore)
│   │
│   ├── navigation/
│   │   └── RootNavigator.jsx         ← Novo
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── *.jsx                 ← Web (componentes Radix)
│   │       └── *.native.jsx          ← Novo: React Native
│   │
│   ├── firebase-export/
│   │   ├── *.jsx                     ← Web
│   │   └── *.native.jsx              ← Novo: React Native
│   │
│   └── lib/
│       ├── AuthContext.jsx           ← Compartilhado
│       └── firebase.js               ← Compartilhado
│
└── README-REACT-NATIVE.md            ← Novo: Documentação
```

---

## 🔑 Informações Importantes

### **AuthContext.jsx Funciona em Ambas?**
Sim! O `AuthContext.jsx` é compartilhado entre web e React Native porque usa:
- ✅ Firebase Auth (funciona em ambas)
- ✅ Firestore (funciona em ambas)
- ✅ Hooks React (funciona em ambas)

### **Ficheiros Adicionais Necessários**

Se ainda não tem, crie:

```javascript
// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Seu config aqui
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## 🎨 Componentes Disponíveis

### Button
```javascript
import { Button } from '@/components/ui/Button.native';

<Button variant="primary" onPress={() => {}}>
  Clique Aqui
</Button>
```

Variantes: `primary`, `secondary`, `destructive`, `outline`

### Input
```javascript
import { Input } from '@/components/ui/Input.native';

<Input
  placeholder="Seu email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>
```

### Card
```javascript
import { Card } from '@/components/ui/Card.native';

<Card>
  <Text>Conteúdo aqui</Text>
</Card>
```

### Label
```javascript
import { Label } from '@/components/ui/Label.native';

<Label>Seu Rótulo</Label>
```

### Alert
```javascript
import { Alert } from '@/components/ui/Alert.native';

<Alert
  variant="destructive"
  title="Erro"
  description="Algo correu mal"
/>
```

---

## 🔧 Próximas Fases

### Fase 2: Integração Completa
- [ ] Carregar dados reais do Firebase
- [ ] Implementar mapas (react-native-maps)
- [ ] Câmara e galeria (expo-image-picker)
- [ ] Testes (Jest + React Native Testing Library)

### Fase 3: Recursos Adicionais
- [ ] Notificações push (Expo Notifications)
- [ ] Armazenamento local (AsyncStorage)
- [ ] Animações (React Native Reanimated)
- [ ] Persistência de dados (SQLite)

### Fase 4: Deploy
- [ ] EAS Build (Expo Application Services)
- [ ] Google Play Store
- [ ] Apple App Store

---

## 🐛 Troubleshooting

### **Problema: "Cannot find module '@/...'"**
**Solução:** Certifique-se que `babel.config.js` tem:
```javascript
plugins: [
  [
    'module-resolver',
    {
      alias: {
        '@': './src',
      },
    },
  ],
],
```

### **Problema: "Firebase not initialized"**
**Solução:** Importe `firebase.js` no seu `AuthContext`:
```javascript
import { auth, db } from '@/lib/firebase';
```

### **Problema: Componentes não renderizam**
**Solução:** Use React Native components:
- ❌ `<div>` → ✅ `<View>`
- ❌ `<p>` → ✅ `<Text>`
- ❌ `<button>` → ✅ `<TouchableOpacity>`

### **Problema: Estilos diferentes no simulador**
**Solução:** React Native não usa CSS, use `StyleSheet`:
```javascript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
```

---

## 📚 Recursos Oficiais

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started/)
- [Firebase + React Native](https://rnfirebase.io/)

---

## 💡 Dicas Importantes

1. **Development vs Production:**
   ```bash
   npm start              # Desenvolvimento local
   npm run build:android  # Build de produção
   npm run build:ios      # Build de produção
   ```

2. **Hot Reload:**
   Pressione `r` no terminal para recarregar
   Pressione `d` para abrir Developer Menu

3. **AsyncStorage para Dados Locais:**
   ```bash
   npm install @react-native-async-storage/async-storage
   ```

4. **Imagens:**
   ```javascript
   import { Image } from 'react-native';
   
   <Image
     source={require('@/assets/logo.png')}
     style={{ width: 200, height: 200 }}
   />
   ```

---

## ✅ Checklist de Setup

- [ ] Copia o package-native.json para package.json
- [ ] Executa `npm install`
- [ ] Verifica se Firebase está configurado em `src/lib/firebase.js`
- [ ] Executa `npm start`
- [ ] Testa em iOS/Android/Web
- [ ] Modifica dados de exemplo com dados reais

---

## 🎓 Próximos Passos Recomendados

1. **Hoje:** Setup e testes básicos
2. **Amanhã:** Carregar dados reais do Firebase
3. **Esta semana:** Implementar recursos principais
4. **Próxima semana:** Build para app stores

---

**Parabéns! 🎉 Seu projecto CloudFlow agora é uma aplicação React Native completa!**

Para dúvidas ou problemas, consulte:
- `REACT-NATIVE-GUIDE.md` - Guia técnico completo
- `MIGRATION-COMPARISON.md` - Comparação Web vs Native
- Documentação oficial dos links acima

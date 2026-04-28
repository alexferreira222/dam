# React Native Migration Guide

## 📱 Transformação do CloudFlow em React Native

Este projecto foi transformado de uma aplicação web React em uma aplicação React Native usando **Expo**.

### ✅ O que foi feito

#### 1. **Estrutura Base**
- `app.json` - Configuração Expo
- `babel.config.js` - Babel com suporte NativeWind
- `index.js` - Ponto de entrada Expo
- `package-native.json` - Dependências React Native

#### 2. **Navegação**
- `src/navigation/RootNavigator.jsx` - Navegação principal com React Navigation
- Stack Navigators para cada secção
- Bottom Tab Navigator para menu principal
- Autenticação integrada

#### 3. **Componentes React Native**
Recriadoscomponentes UI compatíveis com React Native em `src/components/ui/`:
- `Button.native.jsx` - Botões com variantes
- `Input.native.jsx` - Campos de entrada
- `Card.native.jsx` - Cartões
- `Label.native.jsx` - Rótulos
- `Alert.native.jsx` - Alertas
- `Toast.native.jsx` - Notificações
- `Separator.native.jsx` - Separadores
- `ToggleGroup.native.jsx` - Grupos de alternância

#### 4. **Páginas Convertidas**
- `Login.native.jsx` - Autenticação com email/Google
- `Dashboard.native.jsx` - Página inicial com listagem
- `Perfil.native.jsx` - Perfil do utilizador
- `Favoritos.native.jsx` - Lista de favoritos
- `Ranking.native.jsx` - Ranking de utilizadores
- `VenueDetail.native.jsx` - Detalhes do local
- `Admin.native.jsx` - Painel de administração

### 🚀 Como Começar

#### **1. Instalar Dependências**

Use o ficheiro `package-native.json`:

```bash
# Opção 1: Renomear o package.json atual
cp package.json package.json.web  # Guardar a cópia web
cp package-native.json package.json

npm install
```

**Ou opção 2:** Instalar as dependências do React Native:

```bash
npm install expo expo-router expo-constants expo-font expo-linking
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
npm install nativewind
npm install --save-dev babel-preset-expo babel-plugin-module-resolver expo-build-properties
```

#### **2. Estrutura de Ficheiros**

```
CloudFlow/
├── index.js                    (novo)
├── app.json                    (novo)
├── babel.config.js             (novo)
├── package-native.json         (novo)
├── src/
│   ├── App.jsx                 (atualizado)
│   ├── navigation/
│   │   └── RootNavigator.jsx   (novo)
│   ├── components/
│   │   └── ui/
│   │       ├── *.native.jsx    (novos)
│   ├── firebase-export/
│   │   ├── *.native.jsx        (convertidos)
│   └── lib/
│       └── AuthContext.jsx     (existente)
```

#### **3. Iniciar Desenvolvimento**

```bash
# Iniciar servidor Expo
npm start

# iOS (macOS only)
npm run ios

# Android
npm run android

# Web (ainda funciona como PWA)
npm run web
```

### 📝 Mudanças Importantes

#### **Web → React Native**

| Web | React Native |
|-----|------|
| `<div>` | `<View>` |
| `<p>`, `<span>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` |
| `className` (Tailwind) | `style` (StyleSheet) |
| `onClick` | `onPress` |
| CSS Global | StyleSheet.create() |
| `useNavigate()` | `navigation.navigate()` |
| `<Routes>` | Stack/Tab Navigator |

#### **Componentes Removidos**
- Radix UI - Substituído por componentes nativos
- Tailwind CSS - Substituído por NativeWind + StyleSheet
- React Router - Substituído por React Navigation
- Framer Motion - Use React Native Reanimated se necessário

### 🔧 Próximos Passos

#### **1. Integração com Firebase**
O `AuthContext.jsx` já está configurado, mas pode precisar de ajustes para React Native.

```javascript
// Exemplo: Usar AsyncStorage para persistência
import AsyncStorage from '@react-native-async-storage/async-storage';
```

#### **2. Imagens e Ícones**
```bash
npm install react-native-vector-icons
```

#### **3. Mapa (se usar React Leaflet)**
```bash
npm install react-native-maps
```

#### **4. Câmara/Galeria**
```bash
npm install expo-camera expo-image-picker
```

### 🏗️ Estrutura de Navegação

```
Login
├── Google Auth
└── Email/Registar

Main App (Autenticado)
├── Dashboard
│   └── VenueDetail
├── Favoritos
├── Ranking
├── Perfil
└── Admin
```

### 📦 Build para Produção

#### **Android APK**
```bash
npm run build:android
```

#### **iOS IPA**
```bash
npm run build:ios
```

#### **Usando EAS CLI**
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

### 🐛 Troubleshooting

#### **Problema: "Cannot find module '@/...'"**
- Certifique-se que `babel.config.js` tem `module-resolver` configurado

#### **Problema: Firebase não funciona no simulador**
- Verificar configuração do `firebase.js`
- Usar `AsyncStorage` para autenticação persistente

#### **Problema: Estilos não funcionam**
- Use `StyleSheet.create()` para melhor performance
- Verificar se `nativewind` está instalado

### 📚 Recursos Úteis

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [NativeWind](https://www.nativewind.dev)

---

**Nota:** Este projecto pode agora ser desenvolvido tanto como aplicação nativa (iOS/Android) quanto como PWA web usando o mesmo código-base com pequenas adaptações.

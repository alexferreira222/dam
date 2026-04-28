# CloudFlow - React Native Migration

## Instrções para Migração de Web para React Native

### O que foi feito:

1. **Estrutura Base** - Criado projeto Expo com:
   - `app.json` - Configuração da aplicação
   - `babel.config.js` - Configuração Babel com NativeWind
   - `index.js` - Ponto de entrada Expo
   - `package-native.json` - Dependências React Native

2. **Navegação** - Configurado com React Navigation:
   - Stack Navigator para cada secção
   - Bottom Tab Navigator para navegação principal
   - Autenticação integrada

3. **Componentes UI** - Convertidos para React Native:
   - Button
   - Input
   - Card
   - Outros componentes em `src/components/ui`

4. **Configuração Firebase** - Mantida compatibilidade com Firebase

### Próximas Etapas:

1. **Instalar dependências:**
   ```bash
   npm install
   # ou copiar dependências de package-native.json para package.json
   ```

2. **Converter componentes restantes:**
   - Dashboard.jsx
   - Login.jsx
   - Perfil.jsx
   - VenueDetail.jsx
   - Outros componentes específicos

3. **Adaptar estilos:**
   - Substituir Tailwind CSS por StyleSheet do React Native
   - Usar NativeWind para alguns estilos

4. **Testar nas plataformas:**
   ```bash
   npm start          # Expo dev client
   npm run android    # Android
   npm run ios        # iOS (Mac only)
   ```

5. **Configurar ícones e splash screen:**
   - Usar `eas-cli` para build
   - Configurar certificados para iOS

### Estrutura de Ficheiros:
```
src/
├── App.jsx (novo - React Native)
├── navigation/
│   └── RootNavigator.jsx (novo)
├── components/
│   └── ui/
│       ├── Button.native.jsx
│       ├── Input.native.jsx
│       ├── Card.native.jsx
├── firebase-export/ (existentes - adaptar)
├── lib/ (existentes - adaptar)
└── ...
```

### Observações Importantes:

- **NativeWind**: Usa Tailwind com React Native
- **React Navigation**: Substitui React Router
- **Firebase**: Compatível, mas algumas APIs web podem precisar adaptação
- **Componentes Radix UI**: Não existem para React Native - usar componentes nativos
- **Imagens**: Usar `Image` component de React Native

### Diferenças Web → Native:

| Web | Native |
|-----|--------|
| `<div>` | `<View>` |
| `<p>`, `<span>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>`, `<Pressable>` |
| CSS Tailwind | StyleSheet + NativeWind |
| React Router | React Navigation |
| `onclick` | `onPress` |
| `className` | `style` |

### Comandos Úteis:

```bash
# Iniciar dev server
npm start

# Build para produção
npm run build:android
npm run build:ios

# Ejetar do Expo (último recurso)
npm run eject
```

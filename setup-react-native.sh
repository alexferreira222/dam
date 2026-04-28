#!/bin/bash

# CloudFlow React Native Setup Script
# Este script prepara o ambiente para desenvolver com React Native

echo "🚀 CloudFlow React Native Setup"
echo "=================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para imprimir com cores
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# Verificar Node.js
echo "📋 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js não está instalado. Faça download em: https://nodejs.org"
fi
NODE_VERSION=$(node -v)
success "Node.js $NODE_VERSION encontrado"

# Verificar npm
echo ""
echo "📋 Verificando npm..."
if ! command -v npm &> /dev/null; then
    error "npm não está instalado"
fi
NPM_VERSION=$(npm -v)
success "npm $NPM_VERSION encontrado"

# Fazer backup do package.json original
echo ""
echo "💾 Fazendo backup de ficheiros..."
if [ -f "package.json" ]; then
    if [ ! -f "package-web.json" ]; then
        cp package.json package-web.json
        success "Backup criado: package-web.json"
    else
        warning "package-web.json já existe"
    fi
else
    error "package.json não encontrado no diretório atual"
fi

# Copiar package-native.json para package.json
echo ""
echo "📦 Configurando dependências React Native..."
if [ ! -f "package-native.json" ]; then
    error "package-native.json não encontrado"
fi

cp package-native.json package.json
success "package.json actualizado com dependências React Native"

# Instalar dependências
echo ""
echo "📥 Instalando dependências..."
echo "(Isto pode levar alguns minutos...)"
echo ""

if npm install; then
    success "Dependências instaladas com sucesso"
else
    error "Erro ao instalar dependências. Tente: npm install"
fi

# Verificar se o EAS CLI está instalado (opcional)
echo ""
echo "🔧 Configuração adicional..."

if ! command -v eas &> /dev/null; then
    warning "EAS CLI não está instalado (opcional para builds)"
    echo "   Para instalar: npm install -g eas-cli"
else
    success "EAS CLI encontrado"
fi

# Criar .env.local se não existir
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 Criando .env.local..."
    cat > .env.local << 'EOF'
# Firebase Config
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
EOF
    warning ".env.local criado com valores de exemplo"
    warning "⚠️  ADICIONE seus valores reais do Firebase em .env.local"
else
    success ".env.local já existe"
fi

# Verificar se os ficheiros necessários existem
echo ""
echo "✅ Verificando ficheiros necessários..."

REQUIRED_FILES=(
    "app.json"
    "babel.config.js"
    "index.js"
    "src/App.jsx"
    "src/navigation/RootNavigator.jsx"
    "src/lib/AuthContext.jsx"
    "src/lib/firebase.js"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "$file"
    else
        error "$file - FALTA!"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    success "Todos os ficheiros necessários encontrados"
else
    error "${#MISSING_FILES[@]} ficheiros faltam"
fi

# Resumo final
echo ""
echo "════════════════════════════════════════"
echo -e "${GREEN}✅ Setup Concluído com Sucesso!${NC}"
echo "════════════════════════════════════════"
echo ""
echo "📱 Próximos Passos:"
echo ""
echo "1. Adicione suas credenciais Firebase a .env.local"
echo ""
echo "2. Inicie o servidor Expo:"
echo "   npm start"
echo ""
echo "3. Escolha uma plataforma:"
echo "   • iOS:     npm run ios      (macOS only)"
echo "   • Android: npm run android"
echo "   • Web:     npm run web"
echo ""
echo "4. Escanear QR Code:"
echo "   • Abra Expo Go no seu telefone"
echo "   • Escanear o QR code do terminal"
echo ""
echo "📚 Documentação:"
echo "   • SETUP-REACT-NATIVE.md"
echo "   • REACT-NATIVE-GUIDE.md"
echo "   • TRANSFORMATION-SUMMARY.md"
echo ""
echo "❓ Precisa de ajuda?"
echo "   • Leia SETUP-REACT-NATIVE.md"
echo "   • Visite https://docs.expo.dev"
echo "   • Visite https://reactnative.dev"
echo ""

@echo off
REM CloudFlow React Native Setup Script for Windows
REM Este script prepara o ambiente para desenvolver com React Native

echo.
echo 🚀 CloudFlow React Native Setup
echo ==================================
echo.

REM Verificar Node.js
echo 📋 Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ Node.js não está instalado
    echo   Faça download em: https://nodejs.org
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% encontrado
echo.

REM Verificar npm
echo 📋 Verificando npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ npm não está instalado
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION% encontrado
echo.

REM Fazer backup do package.json
echo 💾 Fazendo backup de ficheiros...
if exist package.json (
    if not exist package-web.json (
        copy package.json package-web.json >nul
        echo ✓ Backup criado: package-web.json
    ) else (
        echo ⚠ package-web.json já existe
    )
) else (
    echo ✗ package.json não encontrado
    exit /b 1
)
echo.

REM Copiar package-native.json
echo 📦 Configurando dependências React Native...
if not exist package-native.json (
    echo ✗ package-native.json não encontrado
    exit /b 1
)
copy package-native.json package.json >nul
echo ✓ package.json actualizado com dependências React Native
echo.

REM Instalar dependências
echo 📥 Instalando dependências...
echo (Isto pode levar alguns minutos...)
echo.
call npm install
if %errorlevel% neq 0 (
    echo ✗ Erro ao instalar dependências
    exit /b 1
)
echo ✓ Dependências instaladas com sucesso
echo.

REM Verificar EAS CLI
echo 🔧 Configuração adicional...
where eas >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠ EAS CLI não está instalado (opcional)
    echo   Para instalar: npm install -g eas-cli
) else (
    echo ✓ EAS CLI encontrado
)
echo.

REM Criar .env.local
if not exist .env.local (
    echo 📝 Criando .env.local...
    (
        echo # Firebase Config
        echo VITE_FIREBASE_API_KEY=your_api_key_here
        echo VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
        echo VITE_FIREBASE_PROJECT_ID=your_project_id_here
        echo VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
        echo VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
        echo VITE_FIREBASE_APP_ID=your_app_id_here
        echo VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
    ) > .env.local
    echo ⚠ .env.local criado com valores de exemplo
    echo ⚠ ADICIONE seus valores reais do Firebase em .env.local
) else (
    echo ✓ .env.local já existe
)
echo.

REM Verificar ficheiros necessários
echo ✅ Verificando ficheiros necessários...
setlocal enabledelayedexpansion
set MISSING=0

for %%F in (
    "app.json"
    "babel.config.js"
    "index.js"
    "src\App.jsx"
    "src\navigation\RootNavigator.jsx"
    "src\lib\AuthContext.jsx"
    "src\lib\firebase.js"
) do (
    if exist %%F (
        echo ✓ %%F
    ) else (
        echo ✗ %%F - FALTA!
        set /a MISSING=!MISSING!+1
    )
)

if %MISSING% equ 0 (
    echo ✓ Todos os ficheiros necessários encontrados
) else (
    echo ✗ %MISSING% ficheiros faltam
    exit /b 1
)
echo.

REM Resumo final
echo ════════════════════════════════════════
echo ✅ Setup Concluído com Sucesso!
echo ════════════════════════════════════════
echo.
echo 📱 Próximos Passos:
echo.
echo 1. Adicione suas credenciais Firebase a .env.local
echo.
echo 2. Inicie o servidor Expo:
echo    npm start
echo.
echo 3. Escolha uma plataforma:
echo    • iOS:     npm run ios      (macOS only)
echo    • Android: npm run android
echo    • Web:     npm run web
echo.
echo 4. Escanear QR Code:
echo    • Abra Expo Go no seu telefone
echo    • Escanear o QR code do terminal
echo.
echo 📚 Documentação:
echo    • SETUP-REACT-NATIVE.md
echo    • REACT-NATIVE-GUIDE.md
echo    • TRANSFORMATION-SUMMARY.md
echo.
echo ❓ Precisa de ajuda?
echo    • Leia SETUP-REACT-NATIVE.md
echo    • Visite https://docs.expo.dev
echo    • Visite https://reactnative.dev
echo.

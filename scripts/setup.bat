@echo off
echo 🚀 Setting up Hackathon Review System...

echo 📦 Installing dependencies...
call npm install

echo ⚙️ Creating .env file...
if not exist .env (
    echo # API Configuration > .env
    echo REACT_APP_API_URL=http://localhost:3001 >> .env
    echo. >> .env
    echo # Optional: Enable debug mode >> .env
    echo REACT_APP_DEBUG=false >> .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

echo 🎉 Setup complete!
echo.
echo To start the development server, run:
echo   npm start
echo.
echo To build for production, run:
echo   npm run build
echo.
echo To run tests, run:
echo   npm test
pause

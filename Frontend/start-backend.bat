@echo off
echo Starting Backend...
cd ..\Backend\ElectronicsStore.WebAPI
echo Current directory: %CD%
echo.
echo Installing packages...
dotnet restore
echo.
echo Starting Backend on http://localhost:5000...
dotnet run
pause

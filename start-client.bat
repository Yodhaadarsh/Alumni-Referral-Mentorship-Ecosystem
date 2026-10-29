@echo off
title Alumni Ecosystem - Client
cd /d "%~dp0client"
if not exist node_modules call npm install
call npm run dev
pause

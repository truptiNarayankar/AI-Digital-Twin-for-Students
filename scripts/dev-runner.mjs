import { spawn } from 'node:child_process'
import path from 'node:path'

// Ensure essential Windows system directories are in PATH so cmd.exe and powershell are found
if (process.platform === 'win32') {
  const sysDirs = 'C:\\Windows\\System32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0;'
  if (!process.env.PATH || !process.env.PATH.toLowerCase().includes('c:\\windows\\system32')) {
    process.env.PATH = sysDirs + (process.env.PATH || '')
  }
}

console.log('========================================================')
console.log(' Student Placement Platform - AI Digital Twin')
console.log(' Starting Frontend (Vite) and Backend (Express + MongoDB)')
console.log('========================================================')
console.log('\nFrontend:    http://localhost:5173')
console.log('Backend API: http://localhost:5000\n')

const isWin = process.platform === 'win32'
const npmCmd = isWin ? 'npm.cmd' : 'npm'

// 1. Spawn Frontend (Vite)
const client = spawn(npmCmd, ['run', 'dev'], {
  stdio: 'inherit',
  shell: isWin,
  env: process.env,
})

// 2. Spawn Backend (Express + Mongoose + TSX)
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('server'),
  stdio: 'inherit',
  shell: isWin,
  env: process.env,
})

const handleShutdown = () => {
  try {
    client.kill()
    server.kill()
  } catch {}
  process.exit(0)
}

process.on('SIGINT', handleShutdown)
process.on('SIGTERM', handleShutdown)

client.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`[Frontend] Process exited with code ${code}`)
  }
})

server.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`[Backend] Process exited with code ${code}`)
  }
})

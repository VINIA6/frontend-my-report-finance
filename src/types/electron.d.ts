interface ElectronAPI {
  platform: 'darwin' | 'win32' | 'linux'
  onUpdateAvailable: (cb: () => void) => void
  onUpdateDownloaded: (cb: () => void) => void
  installUpdate: () => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}

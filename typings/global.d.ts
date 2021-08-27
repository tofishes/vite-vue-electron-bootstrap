import { BrowserWindow } from 'electron'

declare global {
  function getWindow(tag: string): BrowserWindow | null
  function registerWindow(tag: string, windowId: number): void
  function getFocusedWindow(): BrowserWindow | null
  function quit(): void
}

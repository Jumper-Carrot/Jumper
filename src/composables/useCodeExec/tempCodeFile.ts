import type { ExecMode } from './useCodeExec'

import { tempDir, join } from '@tauri-apps/api/path'
import { writeTextFile, remove } from '@tauri-apps/plugin-fs'
import { v4 as uuidv4 } from 'uuid'

export async function writeTempCodeFile(
  mode: ExecMode,
  code: string
): Promise<string> {
  const ext = getScriptExtension(mode)
  const uuid = uuidv4()
  const filename = `script-${uuid}.${ext}`
  const filepath = await join(await tempDir(), filename)
  let finalCode = code
  await writeTextFile(filepath, finalCode)
  return filepath
}

export async function removeTempCodeFile(filepath: string) {
  try {
    await remove(filepath)
  } catch (error) {
    console.error(`Failed to remove temp file: ${filepath}`, error)
  }
}

const getScriptExtension = (mode: ExecMode) => {
  switch (mode) {
    case 'get-options':
      return 'py'
    case 'python':
      return 'py'
    case 'cmd':
      return 'cmd'
    case 'javascript':
      return 'js'
    default:
      throw new Error(`Unknown mode: ${mode}`)
  }
}

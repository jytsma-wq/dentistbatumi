import { copyFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const source = resolve(projectRoot, '.openai', 'hosting.json')
const destinationDirectory = resolve(projectRoot, 'dist', '.openai')

await mkdir(destinationDirectory, { recursive: true })
await copyFile(source, resolve(destinationDirectory, 'hosting.json'))

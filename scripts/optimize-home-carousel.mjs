import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

const variants = [
  {
    name: 'desktop',
    dir: path.resolve('src/assets/home-carousel/desktop'),
    quality: 78,
  },
  {
    name: 'mobile',
    dir: path.resolve('src/assets/home-carousel/mobile'),
    quality: 76,
  },
]

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`
}

async function optimizeVariant({ dir, name, quality }) {
  const entries = await readdir(dir, { withFileTypes: true })
  const sourceFiles = entries
    .filter((entry) => entry.isFile() && /\.(png|jpe?g)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))

  if (sourceFiles.length === 0) {
    console.log(`No source PNG/JPG files found in ${name}.`)
    return
  }

  await mkdir(dir, { recursive: true })

  let totalOriginal = 0
  let totalOptimized = 0

  console.log(`\nOptimizing ${name} assets...`)

  for (const fileName of sourceFiles) {
    const sourcePath = path.join(dir, fileName)
    const outputPath = path.join(dir, `${path.parse(fileName).name}.webp`)

    const [{ size: originalSize }, metadata] = await Promise.all([
      stat(sourcePath),
      sharp(sourcePath).metadata(),
    ])

    await sharp(sourcePath)
      .rotate()
      .webp({
        quality,
        effort: 6,
        smartSubsample: true,
      })
      .toFile(outputPath)

    const { size: optimizedSize } = await stat(outputPath)

    totalOriginal += originalSize
    totalOptimized += optimizedSize

    const savings = Math.max(0, Math.round((1 - optimizedSize / originalSize) * 100))

    console.log(
      `- ${fileName} (${metadata.width}x${metadata.height}): ${formatBytes(originalSize)} -> ${formatBytes(optimizedSize)} (${savings}% smaller)`,
    )
  }

  const totalSavings = Math.max(0, Math.round((1 - totalOptimized / totalOriginal) * 100))

  console.log(
    `Total ${name}: ${formatBytes(totalOriginal)} -> ${formatBytes(totalOptimized)} (${totalSavings}% smaller)`,
  )
}

for (const variant of variants) {
  await optimizeVariant(variant)
}

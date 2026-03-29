const kilobyte = 1024
const megabyte = kilobyte * 1024

export function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes < kilobyte) {
    return `${sizeInBytes} B`
  }

  if (sizeInBytes < megabyte) {
    return `${(sizeInBytes / kilobyte).toFixed(1)} KB`
  }

  return `${(sizeInBytes / megabyte).toFixed(1)} MB`
}

import { put, del, list, head } from '@vercel/blob'

// ─── Upload a file to Vercel Blob ─────────────────────────────────────────────
export async function uploadToBlob(
  file: File | Buffer | ReadableStream,
  pathname: string,
  contentType?: string
): Promise<{ url: string; size: number; pathname: string }> {
  const blob = await put(pathname, file, {
    access: 'public',
    contentType,
    addRandomSuffix: true,
  })
  return { url: blob.url, size: 0, pathname: blob.pathname }
}

// ─── Upload raw buffer ────────────────────────────────────────────────────────
export async function uploadBuffer(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const { url } = await uploadToBlob(buffer, `materials/${filename}`, contentType)
  return url
}

// ─── Delete a blob ────────────────────────────────────────────────────────────
export async function deleteBlob(url: string): Promise<void> {
  await del(url)
}

// ─── Get blob metadata ────────────────────────────────────────────────────────
export async function getBlobMetadata(url: string) {
  try {
    return await head(url)
  } catch {
    return null
  }
}

// ─── Fetch blob as Buffer ─────────────────────────────────────────────────────
export async function fetchBlobAsBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch blob: ${response.statusText}`)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// ─── Determine content-type from file extension ───────────────────────────────
export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const map: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    txt: 'text/plain',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    m4a: 'audio/mp4',
    ogg: 'audio/ogg',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  }
  return map[ext] || 'application/octet-stream'
}

// ─── Determine file category ──────────────────────────────────────────────────
export function getFileType(filename: string): 'pdf' | 'video' | 'audio' | 'image' | 'text' | 'url' {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  if (['pdf', 'doc', 'docx'].includes(ext)) return 'pdf'
  if (['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext)) return 'video'
  if (['mp3', 'wav', 'm4a', 'ogg', 'flac'].includes(ext)) return 'audio'
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext)) return 'image'
  return 'text'
}

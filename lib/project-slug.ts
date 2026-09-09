const ILLEGAL_NAME_CHARS = /[^a-zA-Z0-9\s-]/g

export function sanitizeProjectName(raw: string) {
  return raw.replace(ILLEGAL_NAME_CHARS, "").replace(/^[^a-zA-Z0-9]+/, "")
}

export function toProjectSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function isValidProjectSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

/** Short unique suffix so slugified room IDs stay unique. */
export function generateRoomSuffix(length = 6) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789"
  let suffix = ""
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  for (const byte of bytes) {
    suffix += alphabet[byte % alphabet.length]
  }
  return suffix
}

/** Room / project id: slugified name + unique suffix (kept aligned). */
export function toRoomId(name: string, suffix: string) {
  const slug = toProjectSlug(name)
  if (!slug || !suffix) {
    return ""
  }
  return `${slug}-${suffix}`
}

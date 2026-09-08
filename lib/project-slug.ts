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

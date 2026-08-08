export type SectionId =
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'contact'
  | 'resume'

/**
 * A clickable section of the room. There's no floating marker anymore —
 * the 3D object itself (desk, screen, bookcase, ...) is the click target,
 * defined where each is rendered in Room.tsx. This just tracks where the
 * camera should fly to once that section is selected.
 */
export interface SectionWaypoint {
  id: SectionId
  label: string
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
}

export interface ProjectEntry {
  name: string
  tagline: string
  description: string
  stack: string[]
  metrics: string[]
  ndaNote?: string
}

export interface ExperienceEntry {
  company: string
  role: string
  period: string
  highlights: string[]
}

export interface CertEntry {
  title: string
  issuer: string
  date: string
  score?: string
  /** Path under /public, e.g. "/certs/aws-beginners.jpg" */
  image: string
  credentialUrl?: string
}

import type { SectionWaypoint, ProjectEntry, ExperienceEntry, CertEntry } from '../types'

/**
 * Room used to be a hand-built 6x6 shell scaled down 0.8x to feel cozier.
 * It's now the "Modern Neon Room" Sketchfab asset (see Room.tsx), which is
 * already real-world meter scale (~3.6m wide x 5m deep x 3m tall) — no
 * uniform downscale needed. Kept as a named constant (rather than removed
 * outright) since Room.tsx's outer <group scale={ROOM_SCALE}> still reads
 * from it — set back to something other than 1 here if the model ever needs
 * a global nudge.
 */
export const ROOM_SCALE = 1

function scalePoint(p: [number, number, number]): [number, number, number] {
  return [p[0] * ROOM_SCALE, p[1] * ROOM_SCALE, p[2] * ROOM_SCALE]
}

/**
 * Camera waypoints, one per section — each targets the real world-space
 * center of its object in the Modern Neon Room model (measured directly off
 * the glb's mesh bounding boxes, not eyeballed), with the camera position
 * pulled a step into the open room from there. The room is enclosed on 3
 * sides (left wall x≈-1.77, right wall x≈1.73, back wall z≈-1.77) and open
 * only on +Z, so every position below stays inside that box.
 */
const rawSections: { id: SectionWaypoint['id']; label: string; cameraPosition: [number, number, number]; cameraTarget: [number, number, number] }[] = [
  {
    // Screen_Large, wall-mounted on the left wall (x≈-1.77), facing +X.
    id: 'about',
    label: 'About',
    cameraPosition: [-0.5, 1.3, -0.2],
    cameraTarget: [-1.55, 1.15, -0.235],
  },
  {
    // Screen_Medium, wall-mounted on the back wall (z≈-1.77), facing +Z.
    id: 'projects',
    label: 'Projects',
    cameraPosition: [-0.318, 1.25, -0.6],
    cameraTarget: [-0.318, 1.1, -1.5],
  },
  {
    // Shelf, back wall.
    id: 'skills',
    label: 'Skills',
    cameraPosition: [0, 1.5, -0.5],
    cameraTarget: [0, 1.6, -1.55],
  },
  {
    // MCN TV, wall-mounted on the left wall (x≈-1.77), facing +X.
    id: 'experience',
    label: 'Experience',
    cameraPosition: [-0.4, 1.7, 0.6],
    cameraTarget: [-1.577, 2.008, -0.002],
  },
  {
    // The 3 Artwork Frame objects, back wall, high up.
    id: 'education',
    label: 'Education',
    cameraPosition: [0.02, 1.7, -0.5],
    cameraTarget: [0.02, 1.95, -1.6],
  },
  {
    // Computer tower, back wall under the shelf.
    id: 'contact',
    label: 'Contact',
    cameraPosition: [0.6, 1.2, -0.5],
    cameraTarget: [0.476, 1.05, -1.4],
  },
  {
    // Screen_Small, left/back corner.
    id: 'resume',
    label: 'Resume',
    cameraPosition: [-0.6, 1.2, -0.5],
    cameraTarget: [-1.45, 1.05, -1.0],
  },
]

export const sections: SectionWaypoint[] = rawSections.map((s) => ({
  id: s.id,
  label: s.label,
  cameraPosition: scalePoint(s.cameraPosition),
  cameraTarget: scalePoint(s.cameraTarget),
}))

// 3/4 establishing view from the open front of the room (the box is
// enclosed on 3 sides, open on +Z), roughly matching the reference render.
export const defaultCamera = {
  position: scalePoint([1.4, 2.1, 5.2]),
  target: scalePoint([-0.2, 1.2, -0.3]),
}

export const profile = {
  name: 'Adnan Saliyawala',
  title: 'Software Engineer — Backend, ML & Network Security Systems',
  summary:
    "I build backend systems with Spring Boot and FastAPI, and apply ML models — Isolation Forest, Random Forest, KMeans — for anomaly detection in network security contexts. I led FlowZynth, a NetFlow analytics platform with real-time monitoring, RBAC, SSO and LDAP auth, and an automated ML pipeline for threat detection. Comfortable across the stack, from database design and REST APIs to Angular and React frontends.",
  location: 'Godhra, Gujarat, India',
  links: {
    email: 'saliyawalaadnan8@gmail.com',
    phone: '+91-8160054153',
    linkedin: 'https://www.linkedin.com/in/adnan-saliyawala/',
    github: 'https://github.com/nansa1',
    leetcode: 'https://leetcode.com/u/pjvKRUIvCZ/',
  },
}

export const projects: ProjectEntry[] = [
  {
    name: 'FlowZynth',
    tagline: 'Enterprise NetFlow analytics & security monitoring platform',
    description:
      'Led end-to-end design and development of an enterprise platform processing 1M+ flow records per minute. Architected a dual-database system (ClickHouse + SQLite) for sub-second analytics across 50M+ records a day, with enterprise auth (SSO, LDAP, RBAC) for 1,000+ multi-tenant users. Packaged as a one-click OVA appliance for VirtualBox and VMware.',
    stack: ['Spring Boot', 'ClickHouse', 'SQLite', 'Angular', 'Python ML pipeline'],
    metrics: [
      '1M+ flow records/min processed',
      '5x query performance via dual-database design',
      '92%+ anomaly detection accuracy, 35% fewer false positives',
      'New attack patterns detected within 5-minute windows',
      '60% faster incident response via real-time dashboards',
    ],
    ndaNote: 'Architecture and metrics only — production UI is NDA-protected.',
  },
  {
    name: 'NetPulse NPM',
    tagline: 'SNMP-based network performance monitoring prototype',
    description:
      'Currently leading this prototype: polling interface stats, LLDP neighbors, ARP tables, and routing protocols (BGP/OSPF) across network devices, with a FastAPI/SQLAlchemy backend and a React + TypeScript frontend.',
    stack: ['FastAPI', 'SQLAlchemy', 'SQLite', 'React', 'TypeScript'],
    metrics: ['Polls interface, LLDP, ARP & routing data across network devices'],
    ndaNote: 'In-progress internal project — concept description only.',
  },
  {
    name: 'Netziya Agent (EDR Telemetry)',
    tagline: 'Cross-platform endpoint telemetry agent',
    description:
      'Built an EDR agent collecting DNS, process, filesystem, USB, Windows Event Log and system-info telemetry, then ported it from Windows to Linux (Ubuntu 18.04–24.04) while preserving ClickHouse schema compatibility. Also designed a cursor-based infinite-scroll architecture for million-row telemetry views with constant memory footprint.',
    stack: ['Cross-platform agent', 'ClickHouse', 'Cursor-based pagination'],
    metrics: ['Preserves schema compatibility across Windows & Linux', 'Constant 2-3 batch memory footprint at scale'],
    ndaNote: 'Architecture only — internal tooling under NDA.',
  },
  {
    name: 'Aara-V2 E-Commerce Platform',
    tagline: 'Full-stack e-commerce platform (personal project — shareable)',
    description:
      '20+ functional modules with a Java/Spring Boot backend and Angular frontend. Reduced latency from 800ms to 200ms through database optimization and load balancing, with 25+ REST endpoints and JWT-based auth.',
    stack: ['Java', 'Spring Boot', 'Spring Security', 'Angular', 'MySQL', 'JWT'],
    metrics: ['Latency: 800ms → 200ms', '25+ REST endpoints', '70% higher throughput'],
  },
]

export const skillGroups: Record<string, string[]> = {
  Languages: ['Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'HTML5', 'CSS3'],
  'Frameworks & Libraries': ['Spring Boot 2.7', 'FastAPI', 'Angular 17', 'React 18', 'Tailwind CSS', 'Spring Security'],
  Databases: ['MySQL 8.0', 'ClickHouse', 'Firebase', 'SQLite'],
  'Tools & ML': ['Docker', 'Git/GitHub', 'Isolation Forest', 'Random Forest', 'KMeans', 'ClickHouse CLI'],
}

export const experience: ExperienceEntry[] = [
  {
    company: 'NETZIYA Pvt Ltd, Godhra',
    role: 'Software Engineer — Product Development (FlowZynth Project Lead)',
    period: 'Jul 2025 – Present',
    highlights: [
      'Led FlowZynth end-to-end: architecture, ML pipeline, auth, deployment packaging',
      'Built cross-platform EDR telemetry agent, ported Windows → Linux',
      'Leading NetPulse NPM, a new SNMP-based monitoring prototype',
    ],
  },
  {
    company: 'AccioJob Pvt Ltd, Vadodara',
    role: 'Software Development Intern',
    period: 'Oct 2024 – Apr 2025',
    highlights: [
      'Full-stack e-commerce prototype with Spring Boot + Angular, 10+ core features',
      'JWT auth, real-time order tracking, coupon system with 10+ discount types',
    ],
  },
  {
    company: 'Shree Drashti Infotech LLP',
    role: 'Trainee Android Developer',
    period: 'Jan 2022 – Apr 2022',
    highlights: [
      'Real-time messaging app in 12 weeks using Android Studio, Firebase, Java',
      'Improved efficiency 20%, cut crash rates 80%',
    ],
  },
]

export const education = [
  { school: 'Parul University', degree: 'M.C.A. — Cloud Computing', period: '2023 – 2025', score: 'CGPA 8.65/10' },
  { school: 'Navrachana University, Vadodara', degree: 'B.C.A.', period: '2019 – 2022', score: 'CGPA 8.58/10' },
]

/**
 * Each cert renders as its own card in the Education panel (image + details)
 * instead of a plain bullet list. `image` points at /public/certs/<file> —
 * drop the real certificate image/scan there with the matching filename and
 * it appears automatically; until then the card shows a "drop image here"
 * placeholder instead of breaking (same graceful-fallback pattern used
 * throughout this project). Fill in `issuer` / `date` / `credentialUrl` with the exact values
 * off each certificate — the values below are best guesses from what was
 * already in the old one-line list and need to be checked against the real
 * certs.
 */
export const certifications: CertEntry[] = [
  {
    title: 'BCA — Bachelor of Computer Applications',
    issuer: 'Navrachana University, Vadodara',
    date: '2022', 
    score: '8.58 / 10',
    image: '/certs/bca.png',
  },
  {
    title: 'MCA — Master of Computer Applications',
    issuer: 'Parul University, Vadodara',
    date: '2025', 
    score: '8.65 / 10',
    image: '/certs/mca.png',
  },
  {
    title: 'PHP and MySQL Training',
    issuer: 'Spoken Tutorial, IIT Bombay',
    date: '', // TODO: fill in issue date
    score: '69.44 / 100',
    image: '/certs/php-mysql.png',
  },
  {
    title: 'Computer Networks and Internet Protocol Certification',
    issuer: '', // TODO: fill in issuing platform
    date: '', // TODO: fill in issue date
    score: '76 / 100',
    image: '/certs/computer-networks.png',
  },
  {
    title: 'AWS for Beginners',
    issuer: '', // TODO: e.g. AWS / Udemy / Simplilearn — whichever issued it
    date: '', // TODO: fill in issue date
    image: '/certs/aws-beginners.png',
  },
]

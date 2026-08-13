import { useEffect, useState, type JSX } from 'react'
import type { SectionId, CertEntry } from '../types'
import { profile, projects, skillGroups, experience, education, certifications } from '../data/content'

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="font-mono-ui text-[10px] tracking-[0.3em] text-command-accent uppercase mb-4">
      {children}
    </div>
  )
}

function AboutContent() {
  return (
    <div>
      <SectionLabel>About</SectionLabel>
      <h2 className="font-display text-2xl text-command-text mb-1">{profile.name}</h2>
      <p className="text-command-accent text-sm mb-4">{profile.title}</p>
      <p className="text-command-text-dim text-sm leading-relaxed">{profile.summary}</p>
      <p className="text-command-text-dim text-xs mt-4">{profile.location}</p>
    </div>
  )
}

function ProjectsContent() {
  return (
    <div>
      <SectionLabel>Projects</SectionLabel>
      <div className="space-y-6">
        {projects.map((p) => (
          <div key={p.name} className="border-l-2 border-command-border pl-4">
            <h3 className="text-command-text font-display text-lg">{p.name}</h3>
            <p className="text-command-accent text-xs mb-2">{p.tagline}</p>
            <p className="text-command-text-dim text-sm leading-relaxed mb-2">{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {p.stack.map((s) => (
                <span key={s} className="text-[10px] font-mono-ui px-2 py-0.5 border border-command-border text-command-text-dim rounded">
                  {s}
                </span>
              ))}
            </div>
            <ul className="text-xs text-command-text-dim space-y-0.5 mb-1">
              {p.metrics.map((m) => (
                <li key={m}>▸ {m}</li>
              ))}
            </ul>
            {p.ndaNote && <p className="text-[10px] text-command-warn italic mt-1">{p.ndaNote}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsContent() {
  return (
    <div>
      <SectionLabel>Skills</SectionLabel>
      <div className="space-y-4">
        {Object.entries(skillGroups).map(([group, items]) => (
          <div key={group}>
            <h4 className="text-command-text text-xs font-mono-ui uppercase tracking-wider mb-2">{group}</h4>
            <div className="flex flex-wrap gap-1.5">
              {items.map((s) => (
                <span key={s} className="text-xs px-2 py-1 bg-command-panel border border-command-border text-command-text-dim rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExperienceContent() {
  return (
    <div>
      <SectionLabel>Experience</SectionLabel>
      <div className="space-y-5">
        {experience.map((e) => (
          <div key={e.company} className="border-l-2 border-command-border pl-4">
            <h3 className="text-command-text font-display text-base">{e.role}</h3>
            <p className="text-command-accent text-xs mb-0.5">{e.company}</p>
            <p className="text-command-text-dim text-[11px] font-mono-ui mb-2">{e.period}</p>
            <ul className="text-xs text-command-text-dim space-y-1">
              {e.highlights.map((h) => (
                <li key={h}>▸ {h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * One cert = one self-contained panel: image on top, details below. The
 * image gracefully falls back to a "drop it here" placeholder (instead of a
 * broken-image icon) if the file listed in data/content.ts doesn't exist yet
 * — same fallback philosophy used elsewhere in this project (never a broken image).
 */
function CertCard({ cert }: { cert: CertEntry }) {
  const [imgFailed, setImgFailed] = useState(false)
  const meta = [cert.date, cert.score].filter(Boolean).join(' · ')

  return (
    <div className="border border-command-border rounded-lg overflow-hidden bg-command-panel/60">
      <div className="aspect-[4/3] bg-command-bg/60 flex items-center justify-center">
        {!imgFailed ? (
          <img
            src={cert.image}
            alt={cert.title}
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="text-command-text-dim text-[10px] font-mono-ui text-center px-4 leading-relaxed">
            Drop the certificate image at
            <br />
            <code className="text-command-accent">{cert.image}</code>
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-command-text text-sm font-display leading-snug">{cert.title}</h4>
        {cert.issuer && <p className="text-command-accent text-xs mt-0.5">{cert.issuer}</p>}
        {meta && <p className="text-command-text-dim text-[11px] font-mono-ui mt-0.5">{meta}</p>}
        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 text-[10px] font-mono-ui text-command-accent hover:underline"
          >
            View credential ↗
          </a>
        )}
      </div>
    </div>
  )
}

function EducationContent() {
  return (
    <div>
      <SectionLabel>Education & Certifications</SectionLabel>
      <div className="space-y-4 mb-6">
        {education.map((e) => (
          <div key={e.school}>
            <h3 className="text-command-text text-sm font-display">{e.school}</h3>
            <p className="text-command-text-dim text-xs">{e.degree}</p>
            <p className="text-command-text-dim text-[11px] font-mono-ui">{e.period} · {e.score}</p>
          </div>
        ))}
      </div>
      <h4 className="text-command-text text-xs font-mono-ui uppercase tracking-wider mb-3">Certifications</h4>
      <div className="grid grid-cols-1 gap-4">
        {certifications.map((c) => (
          <CertCard key={c.title} cert={c} />
        ))}
      </div>
    </div>
  )
}

/**
 * Real LinkedIn "Profile Badge" embed (platform.linkedin.com/badges/js) —
 * moved here from Room.tsx. It's a script-injected iframe, which only
 * lays out correctly in normal document flow; it broke (huge, unstyled,
 * blurry) when rendered inside Room.tsx's <Html transform> 3D node,
 * because Chromium's iframe layout loses its own CSS under a matrix3d
 * transform. This panel is plain flat DOM, so the badge renders as
 * LinkedIn intends. Falls back to a plain link if the badge iframe never
 * loads (offline, ad-blocker, or the LinkedIn "Profile badge" privacy
 * setting is off) so Contact never shows a dead space.
 */
function LinkedInBadge() {
  const [scriptFailed, setScriptFailed] = useState(false)

  useEffect(() => {
    if (document.getElementById('linkedin-badge-script')) return
    const script = document.createElement('script')
    script.id = 'linkedin-badge-script'
    script.src = 'https://platform.linkedin.com/badges/js/profile.js'
    script.async = true
    script.defer = true
    script.onerror = () => setScriptFailed(true)
    document.body.appendChild(script)
  }, [])

  if (scriptFailed) {
    return (
      <a
        href={profile.links.linkedin}
        target="_blank"
        rel="noreferrer"
        className="block text-command-text-dim text-xs hover:text-command-accent transition-colors"
      >
        {profile.links.linkedin}
      </a>
    )
  }

  return (
    <div
      className="badge-base LI-profile-badge"
      data-locale="en_US"
      data-size="large"
      data-theme="light"
      data-type="VERTICAL"
      data-vanity="adnan-saliyawala-725974141"
      data-version="v1"
    >
      <a
        className="badge-base__link LI-simple-link"
        href="https://in.linkedin.com/in/adnan-saliyawala-725974141?trk=profile-badge"
        target="_blank"
        rel="noreferrer"
      >
        Adnan Saliyawala
      </a>
    </div>
  )
}

function ContactContent() {
  return (
    <div>
      <SectionLabel>Contact</SectionLabel>
      <div className="space-y-3 text-sm">
        <a href={`mailto:${profile.links.email}`} className="block text-command-text hover:text-command-accent transition-colors">
          {profile.links.email}
        </a>
        <p className="text-command-text-dim">{profile.links.phone}</p>
      </div>

      <div className="mt-4 space-y-1 text-xs">
        <a href={profile.links.github} target="_blank" rel="noreferrer" className="block text-command-text-dim hover:text-command-accent transition-colors">
          {profile.links.github}
        </a>
        <a href={profile.links.leetcode} target="_blank" rel="noreferrer" className="block text-command-text-dim hover:text-command-accent transition-colors">
          {profile.links.leetcode}
        </a>
      </div>

      <div className="mt-6">
        <LinkedInBadge />
      </div>
    </div>
  )
}

function ResumeContent() {
  return (
    <div>
      <SectionLabel>Resume</SectionLabel>
      <p className="text-command-text-dim text-sm mb-4">Download a copy of the full resume.</p>
      <a
        href="/resume.pdf"
        download
        className="inline-block text-xs font-mono-ui px-4 py-2 bg-command-accent text-command-bg rounded hover:bg-command-accent-soft transition-colors"
      >
        Download PDF ↓
      </a>
      <p className="text-command-text-dim text-[10px] mt-3">
        Drop your resume file at <code>public/resume.pdf</code> to wire this up.
      </p>
    </div>
  )
}

const CONTENT: Record<SectionId, () => JSX.Element> = {
  about: AboutContent,
  projects: ProjectsContent,
  skills: SkillsContent,
  experience: ExperienceContent,
  education: EducationContent,
  contact: ContactContent,
  resume: ResumeContent,
}

export default function ContentPanel({
  section,
  onClose,
}: {
  section: SectionId | null
  onClose: () => void
}) {
  const Body = section ? CONTENT[section] : null

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-105 z-40 bg-command-panel/95 backdrop-blur-sm border-l border-command-border
      transition-transform duration-500 ease-out overflow-y-auto scanline
      ${section ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 font-mono-ui text-xs text-command-text-dim hover:text-command-accent transition-colors border border-command-border rounded px-2 py-1"
      >
        ESC ✕
      </button>
      <div className="px-8 py-16">{Body && <Body />}</div>
    </div>
  )
}

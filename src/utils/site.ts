/**
 * Site-wide constants. Everything that identifies Cody lives here so it is
 * changed in one place.
 */
export const site = {
  name: 'Cody Emami',
  handle: 'CODY.EMAMI',
  title: 'Cody Emami — Software Developer & Electrical Engineering Student',
  description:
    'Software developer and electrical engineering student building IoT systems, CAD software, robotics, and web applications.',
  location: 'Las Vegas, NV',
  email: 'codyemami@gmail.com',
  github: 'https://github.com/CEMAMI09',
  githubHandle: 'CEMAMI09',
  linkedin: 'https://www.linkedin.com/in/cody-emami-65970b394/',
  /** Root of the path convention used in the path bar: ~/cody/... */
  pathRoot: '~/cody',
  /** Public URL of the resume, when the file exists (see utils/assets.ts). */
  resumePath: '/cody-emami-resume.pdf',
} as const;

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/** One segment of the path bar breadcrumb. Omit `href` on the current page. */
export interface Crumb {
  label: string;
  href?: string;
}

export const primaryNav: readonly NavItem[] = [
  { label: 'Projects', href: '/projects' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
  { label: 'GitHub', href: site.github, external: true },
];

/** Year shown in the footer and metadata. Evaluated at build time. */
export const buildDate = new Date();

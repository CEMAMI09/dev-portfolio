import type { IconName } from './types';

export interface DesktopApp {
  id: string;
  href: string;
  label: string;
  icon: IconName;
  /** Title shown in the window chrome, e.g. PROJECTS.APP */
  title: string;
  /** Path shown under the title bar. */
  path: string;
  description: string;
}

export const desktopApps: readonly DesktopApp[] = [
  {
    id: 'resume',
    href: '/resume',
    label: 'resume',
    icon: 'document-prompt',
    title: 'RESUME.APP',
    path: '~/cody/resume.app',
    description: 'resume PDF',
  },
  {
    id: 'projects',
    href: '/projects',
    label: 'projects',
    icon: 'folder-search',
    title: 'PROJECTS.APP',
    path: '~/cody/projects',
    description: 'three engineering projects',
  },
  {
    id: 'work',
    href: '/work',
    label: 'work',
    icon: 'briefcase',
    title: 'WORK.APP',
    path: '~/cody/work.app',
    description: 'professional experience',
  },
  {
    id: 'about',
    href: '/about',
    label: 'about',
    icon: 'person',
    title: 'ABOUT.APP',
    path: '~/cody/about.txt',
    description: 'about Cody',
  },
];

export function appByHref(pathname: string): DesktopApp | undefined {
  return desktopApps.find((app) => pathname === app.href || pathname.startsWith(`${app.href}/`));
}

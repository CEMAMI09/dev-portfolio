import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Project entries live in src/content/projects/*.md.
 *
 * Frontmatter carries the structured record (dates, status, links, feature
 * lists, spec tables, diagrams, image references). The Markdown body carries
 * the long-form engineering notes. Each project has its own page under
 * src/pages/projects/ that decides how to compose these pieces, so the data
 * stays uniform while the presentation can differ per project.
 */

const image = z.object({
  /** Public path, e.g. "/assets/struct/dashboard.png". Rendered as a placeholder until the file exists. */
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  /** Visual treatment applied on cards. Original is revealed on demand. */
  treatment: z.enum(['none', 'gray', 'dither', 'halftone']).default('dither'),
  /** Intrinsic aspect ratio used to reserve space, e.g. "16 / 10". */
  aspect: z.string().default('16 / 10'),
});

const link = z.object({
  url: z.url(),
  label: z.string(),
  /** Set true only once the URL has been confirmed to serve the project. */
  verified: z.boolean().default(true),
  note: z.string().optional(),
});

const table = z.object({
  id: z.string(),
  title: z.string(),
  /** Column headings. Omit for two-column label/value tables. */
  columns: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())),
  caption: z.string().optional(),
  /** Explicit qualifier shown prominently, e.g. "MODELED EXAMPLE — NOT PRODUCTION CUSTOMER DATA". */
  disclaimer: z.string().optional(),
});

const diagram = z.object({
  id: z.string(),
  title: z.string(),
  direction: z.enum(['row', 'column']).default('column'),
  steps: z.array(
    z.object({
      label: z.string(),
      sub: z.string().optional(),
    }),
  ),
  caption: z.string().optional(),
});

const namedList = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(z.string()),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    order: z.number().int().positive(),
    title: z.string(),
    /** Short descriptor for record headers, e.g. "IoT GATEWAY". */
    kicker: z.string(),
    category: z.string(),
    start: z.string().regex(/^\d{4}-\d{2}$/),
    end: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .nullable()
      .default(null),
    status: z.object({
      label: z.string(),
      kind: z.enum(['active', 'wip', 'planned', 'paused']),
      detail: z.string().optional(),
    }),
    summary: z.string(),
    why: z.string(),
    built: z.string(),
    links: z.object({
      source: link,
      live: link.optional(),
    }),
    tech: z.array(z.string()).min(1),
    features: z.array(
      z.object({
        group: z.string().optional(),
        items: z.array(z.string()).min(1),
      }),
    ),
    lists: z.array(namedList).default([]),
    tables: z.array(table).default([]),
    diagrams: z.array(diagram).default([]),
    hero: image,
    currentStatus: z.string(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

export const collections = { projects };

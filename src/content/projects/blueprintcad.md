---
order: 3
title: BLUEPRINTCAD
kicker: CAD PLATFORM
category: CAD / Web Platform / 3D
start: 2023-10
end: null
status:
  label: Partially active
  kind: active
  detail: Core systems functional; some features still being completed
summary: >-
  BlueprintCAD is a platform for uploading, previewing, organizing, sharing,
  and selling CAD and 3D-model files. It combines browser-based 3D viewing
  with project storage, collaboration, storefronts, payments, and community
  features. The frontend is still online, but the backend is currently offline because the hosted backend/database are no longer being paid for.
why: >-
  I started BlueprintCAD because CAD files are awkward to share and
  collaborate on compared with normal software projects. I wanted one place
  where a design could be stored, previewed in the browser, versioned, shared
  with a team, and eventually sold or sent for manufacturing.
built: >-
  Designed and developed the platform across the frontend, backend, database,
  file-storage system, authentication, payments, 3D viewing, marketplace, and
  project-management features.
links:
  source:
    url: https://github.com/CEMAMI09/BlueprintCAD
    label: github.com/CEMAMI09/BlueprintCAD
  live:
    url: https://blueprintcad.io
    label: blueprintcad.io
    verified: true
tech:
  - Next.js
  - React
  - TypeScript
  - Three.js
  - Express
  - PostgreSQL
  - Cloudflare R2
  - Stripe
features:
  - group: Files and viewing
    items:
      - Upload and organize CAD projects
      - Browser-based 3D previews
      - Storage for additional CAD formats
      - Thumbnails
      - Project metadata
  - group: Formats previewed in the browser
    items:
      - STL
      - OBJ
      - FBX
      - GLTF / GLB
      - PLY
      - Collada
  - group: Organization and collaboration
    items:
      - Folders
      - Team roles
      - Activity history
      - Branch/version concepts
      - Public/private projects
      - Share links
  - group: Marketplace
    items:
      - Creator storefronts
      - Marketplace listings
      - Stripe checkout
      - Subscription tiers
      - Manufacturing quote tooling
  - group: Community and analytics
    items:
      - Discovery/explore
      - Profiles
      - Following
      - Forum
      - Messaging UI
      - Analytics
tables:
  - id: subsystems
    title: Subsystem status
    columns: ['Subsystem', 'Status']
    rows:
      - ['3D viewing', 'Functional']
      - ['Upload and storage', 'Functional']
      - ['Authentication', 'Functional']
      - ['Marketplace and storefronts', 'Functional']
      - ['Subscriptions', 'Functional']
      - ['Dashboard and analytics', 'Functional']
      - ['Collaboration', 'In progress']
      - ['Versioning / branches', 'In progress']
      - ['Messaging', 'In progress']
      - ['Order management', 'In progress']
    caption: Status as of September 2026.
diagrams:
  - id: architecture
    title: Architecture
    direction: column
    steps:
      - label: Next.js / Vercel
        sub: frontend, Three.js viewer
      - label: Express API / Railway
        sub: authentication, projects, marketplace, payments
      - label: PostgreSQL + Cloudflare R2
        sub: metadata in Postgres, files in R2
hero:
  src: /assets/blueprintcad/viewer.svg
  alt: BlueprintCAD dashboard with project stats, activity, and 3D preview thumbnails
  caption: Project dashboard
  treatment: none
  aspect: 1968 / 1035
currentStatus: >-
  BlueprintCAD is partially active. Core viewing, upload,
  authentication, marketplace, storefront, subscription, dashboard, and
  analytics systems are functional. Some collaboration, versioning, messaging,
  and order-management features are still being completed.
seo:
  title: BlueprintCAD — upload, preview, share, and sell CAD files
  description: >-
    A web platform for CAD and 3D-model files with browser-based viewing,
    project storage, collaboration, storefronts, and Stripe payments. Built
    by Cody Emami since 2023.
---

## Browser CAD viewing

Models are loaded into a Three.js scene from several mesh formats: STL, OBJ, FBX, GLTF/GLB, PLY, and Collada. Orbit controls work with a mouse and with touch on phones and tablets. The same loading path generates preview thumbnails and reads basic file metadata when a project is uploaded. Formats the viewer cannot render are still stored and available for download.

## File architecture

Project records, folder structure, permissions, and activity history live in PostgreSQL. The CAD files themselves are large and rarely change, so they are stored in Cloudflare R2 and referenced by key from the database. Keeping the two apart keeps database rows small and lets file storage scale independently of the application data.

## Frontend / backend separation

The Next.js frontend deploys to Vercel. The Express API deploys to Railway and owns the database connection and the file-handling logic. Deploying them separately means either side can be changed and redeployed without touching the other.

## Marketplace and subscriptions

Creators can list models for sale from a storefront attached to their profile. Checkout runs through Stripe, and subscription tiers are handled through Stripe as well. Sales and listing activity are reflected in the creator dashboard and analytics.

## Collaboration

Projects can be public or private and are organized into folders. Folder roles control who can view or edit, collaborators are invited by folder, and changes are recorded in an activity history. Parts of this, along with the branch/version model for design iterations, are still being completed.

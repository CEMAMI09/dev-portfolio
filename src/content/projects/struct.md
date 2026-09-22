---
order: 1
title: STRUCT
kicker: IoT GATEWAY
category: IoT / Networking / Backend Systems
start: 2026-07
end: null
status:
  label: Active development
  kind: active
  detail: Public deployment not yet verified
summary: >-
  Struct is a lightweight IoT gateway for devices that cannot afford to waste
  bandwidth on large HTTPS/JSON requests. Devices send packed binary structs
  over TCP or UDP. The gateway authenticates the frame, resolves its schema,
  stores telemetry, and forwards normal JSON webhooks.
why: >-
  Cellular and battery-powered devices can spend more time and data
  establishing HTTPS connections than transmitting the actual sensor reading.
  Struct moves that complexity to the gateway so device firmware can stay
  small while the cloud side still behaves like a normal web service.
built: >-
  Built the product end-to-end, including authentication, organization/RBAC
  management, schema tooling, binary TCP/UDP ingestion, telemetry storage,
  billing, webhook delivery, a device simulator, and an ESP32 example.
links:
  source:
    url: https://github.com/CEMAMI09/Struct
    label: github.com/CEMAMI09/Struct
  live:
    url: https://struct.dev
    label: struct.dev
    verified: false
    note: Domain reserved; does not serve the application yet
tech:
  - Nuxt 4
  - Vue 3
  - TypeScript
  - Node.js
  - Supabase
  - PostgreSQL
  - Stripe
  - Rust
  - eBPF/XDP
features:
  - group: Ingestion and protocol
    items:
      - Authenticated Protocol v2 uplinks using key ID, schema version, timestamp, nonce, and HMAC
      - TCP and UDP ingestion
      - Optional ChaCha20-Poly1305 payload encryption
      - Queued device downlinks
  - group: Schemas and data
    items:
      - Schema builder
      - Generated C++ headers
      - Immutable schema versions
      - Telemetry dashboard
  - group: Delivery and operations
    items:
      - HMAC-signed HTTPS webhook destinations
      - Organization roles
      - Audit logs
      - Stripe billing
      - Bulk device import
      - Device simulator and MCU example
tables:
  - id: bandwidth
    title: Modeled bandwidth
    disclaimer: MODELED EXAMPLE — NOT PRODUCTION CUSTOMER DATA
    rows:
      - ['Packed sample payload', '9 B']
      - ['Authenticated protocol frame', '~75 B']
      - ['Example cold HTTPS uplink (comparison)', '~5.2 KB']
      - ['Modeled reduction', 'up to ~99%']
    caption: >-
      The frame figure includes the authentication fields. The HTTPS figure is
      an example of a cold TLS handshake plus a small JSON request; it is not a
      measurement taken from any customer device.
  - id: fleet
    title: Example modeled fleet
    disclaimer: MODELED EXAMPLE — NOT PRODUCTION CUSTOMER DATA
    rows:
      - ['Devices', '10,000']
      - ['Uplink pattern', '1 cold uplink / minute']
      - ['Transfer avoided', '~2.2 TB / month']
      - ['Cost avoided', '~$2,400 / month at $1.10 / GB']
    caption: >-
      Arithmetic on the figures above: 10,000 devices × 43,200 uplinks per
      month × (5.2 KB − 75 B).
diagrams:
  - id: dataflow
    title: Data flow
    direction: row
    steps:
      - label: Device
        sub: packed binary struct
      - label: TCP / UDP listener
        sub: Protocol v2 frame
      - label: Authenticate
        sub: HMAC · nonce · rate limit
      - label: Resolve schema
        sub: immutable version
      - label: Store telemetry
        sub: PostgreSQL
      - label: Webhook
        sub: HMAC-signed JSON
      - label: Customer endpoint
    caption: Downlinks travel the other way and are queued on the gateway for the device.
hero:
  src: /assets/struct/dashboard.svg
  alt: Struct telemetry dashboard listing recent device uplinks
  caption: Telemetry dashboard
  treatment: none
  aspect: 3420 / 1914
gallery:
  - src: /assets/struct/schema-builder.png
    alt: Struct schema builder alongside the C++ header it generated
    caption: Schema builder and generated header
    aspect: 16 / 10
  - src: /assets/struct/simulator.png
    alt: Struct device simulator sending frames to the gateway
    caption: Device simulator
    aspect: 16 / 10
  - src: /assets/struct/webhooks.png
    alt: Webhook destination configuration with signing key
    caption: Webhook destinations
    aspect: 16 / 10
currentStatus: >-
  Struct is in active development and the source is public. A hosted
  deployment at struct.dev is planned; at the time of publishing the domain
  does not yet serve the application, so the link is listed for reference
  rather than as a working demo.
seo:
  title: Struct — IoT gateway for packed binary telemetry
  description: >-
    A lightweight IoT gateway that accepts packed binary structs over TCP or
    UDP, authenticates them, resolves their schema, stores telemetry, and
    forwards JSON webhooks. Built by Cody Emami.
---

## Binary protocol

A device does not send JSON. It sends a packed struct, the same bytes its firmware already holds in memory, wrapped in a small Protocol v2 frame that carries a key ID, schema version, timestamp, nonce, and HMAC. The example sensor payload is 9 bytes; the full authenticated frame is around 75 bytes. Only the gateway needs to know what the bytes mean, so downstream consumers still receive ordinary JSON.

## Replay protection

UDP frames can be captured and re-sent, so each frame carries a nonce that the gateway records in PostgreSQL rather than in process memory. A restart does not reset the set of seen nonces. Rate limiting sits in front of that check so a flood of invalid frames is rejected before it costs a database round trip.

## Schema versions

Payload layouts are defined on the server in the schema builder and published as immutable versions. The device references the version in the frame header, so a field stays as narrow as the firmware packs it while the cloud side can still turn it into a named, typed JSON property. Changing a layout means publishing a new version; devices built against an older version keep working. The builder also emits a C++ header so the firmware struct and the server schema come from one definition.

## Billing

Struct bills on a period high-water mark: the peak usage level reached during a billing period, rather than a running per-message meter. A short spike is billed at that peak for the period; usage that falls afterwards is not billed for capacity no longer in use. Stripe handles subscriptions and invoicing.

## Optional fast parser

The reference frame parser is TypeScript. A Rust implementation exposed through napi-rs exists as an optional path for higher-throughput ingestion. The system does not depend on it.

## XDP experiment

An experimental Linux XDP/eBPF program filters UDP traffic in the kernel before it reaches the application process. It is not part of the normal deployment path and is documented as an experiment.

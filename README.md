# Maplocale Core

> Geospatial data infrastructure for Nigeria's unmapped roads, paths, and routes.

---

## The Problem

Millions of Nigerians navigate roads, footpaths, and shortcuts every day that don't exist on any map. Google Maps knows the highways, it doesn't know how you actually get home. That missing data has a real cost: deliveries fail, ambulances take wrong turns, and every app built for Nigerian users inherits the same broken foundation.

This isn't a data quality problem. It's a data existence problem. The coordinates for these routes have never been collected at scale.

---

## What Maplocale Does

Maplocale fixes this by actually going out and collecting the data. We record GPS tracks on the ground, clean them, and store verified route geometries in a spatial database, then expose everything through an API that developers, logistics companies, and institutions can build on.

We started on the University of Ilorin campus, mapping paths and shortcuts that exist in real life but nowhere else. That's already live. The plan is to scale the same process outward, area by area, until the map reflects how Nigeria actually moves.

---

## Why Existing Solutions Fall Short

Google Maps looks complete from the air but breaks at street level, their pipeline was never built for informal Nigerian routes. OpenStreetMap is editable by anyone, but almost nobody in Nigeria is editing it. Logistics platforms like Kobo360 have quietly built their own workarounds, but those are internal tools, not infrastructure anyone else can use.

Nobody is solving the underlying problem. Maplocale isn't competing with Google Maps, it's building the data layer that makes any reliable location service in Nigeria possible.

---

## How It Works

1. **Collect** — GPS tracks recorded on the ground via mobile
2. **Clean** — accuracy filtering, deduplication, and speed-based outlier removal
3. **Store** — verified route geometries saved as GeoJSON (SRID 4326) in PostGIS
4. **Expose** — routing, geocoding, and spatial queries available through a developer API

---

## Stack

NestJS · TypeScript · PostgreSQL · PostGIS · Prisma · React · Turborepo · Google Cloud Run · Vercel

---

## Status

Working prototype. Live GPS data collected and verified on the Unilorin campus. Backend API and MapLocale Studio console are actively in development.

---

## Vision

Maplocale is infrastructure, not an app. The goal is a spatial data layer that any developer, institution, or company building for Nigeria can depend on, the same way you'd depend on a roads API anywhere else in the world.
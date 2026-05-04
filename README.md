# ModCheck

A free tool that tells car enthusiasts whether their specific vehicle modifications are legal in any US state.

**Live:** https://mod-check-eight.vercel.app

## What it does

Pick your mods (window tint VLT %, exhaust type/decibels, suspension lift/lowering) and ModCheck cross-references them against every US state's vehicle code. You get instant green/yellow/red verdicts plus the actual law text and fines.

## Features

- 50-state dashboard with a tile map and color-coded summary
- Per-state breakdown with statute notes, fines, and full law details
- Side-by-side state comparison (useful for road trips)
- Home state pin
- Visiting vs registering toggle (state reciprocity for out-of-state plates)
- Vehicle preset chips
- Shareable verdict URLs
- VLT visual reference

## Stack

React Native + TypeScript + Expo (web, iOS, Android from one codebase). Supabase (Postgres) for the law database. Deployed on Vercel.

## Run locally

```bash
npm install
npx expo start
```

## Disclaimer

ModCheck provides general information about vehicle modification laws for educational purposes only. Laws change and enforcement varies. Always verify current regulations with your state's DMV before making modification decisions.

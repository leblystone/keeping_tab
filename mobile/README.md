# Keeping Tab — Mobile (Expo)

Native React (Expo / React Native) app for iOS + Android. Primary ship target.

## Run

```bash
cd mobile
npm install
npx expo start
```

Then:
- press `i` for iOS Simulator
- press `a` for Android emulator
- scan the QR with **Expo Go** on a physical device (same Wi‑Fi)

Web preview (secondary): `npx expo start --web`

## Structure

- `app/` — Expo Router screens (Home, Onboarding, Packs, Cards)
- `src/` — theme, components, storage, progress context
- `data/cards.json` — 99-card catalog
- `assets/cards/` — flattened Canva backgrounds

# Monk - Mood Check-in App

## Tech Stack

- Vue 3 (`<script setup>` + Composition API)
- TypeScript
- Vite
- Tailwind CSS v4
- Reka UI + shadcn-vue style components
- GSAP (animation utility dependency)
- Lucide Vue Next (icons)
- Web Audio API + Vibration API
- `localStorage` (client-side persistence)

## Loyiha haqida

**Monk** - bu kunlik kayfiyatni tez va sodda tarzda belgilash uchun yaratilgan frontend ilova.  
Foydalanuvchi 2D mood-grid ichida knob ni sudrab holatini tanlaydi, `Save Mood` bosadi va tarix hamda streak natijalarini ko'radi.

Bu loyiha **backend talab qilmaydi**: barcha ma'lumotlar brauzer ichida saqlanadi.

## Asosiy imkoniyatlar

- 2D drag mood selector (Anxious, Excited, Sad, Calm)
- Inertia/lag effekti bilan tabiiy harakat hissi
- Mood saqlash va oxirgi 20 ta yozuv tarixini ko'rsatish
- Daily streak hisoblash
- Dark mode toggle
- Mute/unmute va synth sound effektlari
- Mobilga mos pointer/touch boshqaruvi (`touch-none`, pointer capture)

## Demo oqimi

1. Knob ni drag qilib kayfiyat tanlang
2. Kartada mood nomi, energy va valence ko'rinadi
3. `Save Mood` ni bosing
4. Headerda streak yangilanadi
5. `History` modalida frequency va recent check-in lar ko'rinadi

## Project structure

```txt
src/
├── App.vue
├── main.ts
├── style.css
├── components/
│   ├── MoodBox.vue
│   ├── MoodCard.vue
│   ├── MoodHistory.vue
│   ├── store/
│   │   ├── useStore.ts
│   │   └── soundEffect.ts
│   └── ui/button/
└── lib/new-york-v4/lib/utils.ts
```

## Muhim texnik yechimlar

### 1) Mood aniqlash (quadrant mapping)

`pos.x` va `pos.y` (0-100%) qiymatlari asosida aktiv mood `computed` orqali aniqlanadi.

### 2) Inertia fizikasi

Drag tugagach `requestAnimationFrame` loop bilan tezlik asta kamayadi (`FRICTION`), chetga urganda damping qo'llanadi.

### 3) Pointer xavfsizligi

- `setPointerCapture` / `releasePointerCapture`
- `preventDefault()` pointer eventlarda
- `touch-none` orqali mobil scroll konfliklarini oldini olish

### 4) Persistence

- `moodHistory` -> `localStorage`
- `streak` -> `localStorage`
- `theme` va `muted` holatlari ham saqlanadi

### 5) Audio va haptic feedback

- Web Audio API orqali `tick`, `ding`, `chime`
- `navigator.vibrate` orqali qisqa haptic signal

## Local development

### Talablar

- Node.js 18+ (yoki undan yuqori)
- `pnpm`

### O'rnatish

```bash
pnpm install
```

### Development server

```bash
pnpm dev
```

### Production build

```bash
pnpm build
```

### Build preview

```bash
pnpm preview
```

## Scriptlar

- `pnpm dev` - lokal development server
- `pnpm build` - type-check + production build
- `pnpm preview` - build qilingan app ni lokal preview

## Deploy

Statik frontend sifatida istalgan hostingga deploy qilish mumkin:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages (Vite static output)

Build natijasi odatda `dist/` papkaga chiqadi.

## UX va platforma eslatmalar

- Ilova desktop va mobil pointer/touch interaction uchun optimizatsiya qilingan.
- Birinchi audio trigger ba'zi brauzerlarda user interactiondan keyin faollashadi (normal browser policy).
- Ma'lumotlar brauzer storage tozalansa o'chadi.

## Roadmap (takliflar)

- Mood filtrlash va date range analytics
- Export/import (JSON)
- Multi-language UI
- Optional cloud sync (auth + backend)

## License

Private project.

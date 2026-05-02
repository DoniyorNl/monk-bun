# Monk — Mood Check-in App

> **Bu loyihani Upwork platformasida mijoz buyurtmasi sifatida qabul qilib, mustaqil ravishda ishlab chiqdim.**  
> Maqsad: foydalanuvchi har kuni o'z kayfiyatini kuzatib borishi uchun minimal, chiroyli va mobilga qulay vosita yaratish.

---

## Loyiha haqida

**Monk** — kunlik kayfiyat kuzatuvi (mood check-in) uchun mo'ljallangan Vue 3 ilovasi. Foydalanuvchi 2D drag knob orqali kayfiyatini belgilaydi, saqlaydi, va tarixini kuzatib boradi. Hech qanday backend yoki server kerak emas — barcha ma'lumotlar brauzerning `localStorage`da saqlanadi.

**Stack:** Vue 3 · TypeScript · Tailwind CSS v4 · Vite · Web Audio API

---

## Ishga tushirish

```bash
pnpm install
pnpm dev
```

---

## Asosiy 5 ta Mantiq (Core Logic)

### 1. 2D Drag Knob — Kayfiyat tanlash mexanizmi

`MoodBox.vue` ichidagi 300×300 px maydonda foydalanuvchi kichik doirachani (knob) sudrab harakatlantiradi. Maydon 4 ta kvadrantga bo'lingan: **Anxious** (yuqori-chap), **Excited** (yuqori-o'ng), **Sad** (pastki-chap), **Calm** (pastki-o'ng).

`useStore.ts` ichidagi `activeMood` — bu `computed` property:

```ts
const col = pos.value.x > 50 ? 1 : 0
const row = pos.value.y > 50 ? 1 : 0
const map: Mood[][] = [
  [MOODS.anxious, MOODS.excited],
  [MOODS.sad,     MOODS.calm  ],
]
return map[row][col]
```

Knob koordinatasi (0–100% oralig'ida) kvadrantni aniqlab beradi. `MoodCard` shu `activeMood`ga reaktiv bog'langan va avtomatik yangilanadi.

---

### 2. Inertia (Lag effekti) — Fizikaviy siljish hissi

Foydalanuvchi knobni qo'yib yuborganda u darhol to'xtamaydi — oldingi tezlikni saqlab, asta-sekin susayib boradi. Bu `startInertia()` funksiyasi orqali amalga oshiriladi:

```ts
const FRICTION = 0.94
const MIN_VELOCITY = 0.05

function animate() {
  pos.value.x = clamp(pos.value.x + velocity.x)
  pos.value.y = clamp(pos.value.y + velocity.y)

  velocity.x *= FRICTION
  velocity.y *= FRICTION

  const stopped =
    Math.abs(velocity.x) < MIN_VELOCITY &&
    Math.abs(velocity.y) < MIN_VELOCITY

  if (!stopped) frame = requestAnimationFrame(animate)
}
```

`FRICTION = 0.94` har kadrda tezlikni 6% pasaytiradi. Chegara (0 yoki 100%)ga urilganda tezlik yana 50% qo'shimcha kamayadi — "devor effekti" hosil qiladi.

---

### 3. `preventDefault()` — Qayerlarda va nima uchun

**`onPointerDown`:**
```ts
e.preventDefault()
```
Brauzer knob elementini o'zi sudrab ketmasligi (native drag), matn tanlanmasligi va mobilda long-press context menuni tiqib qo'ymasligi uchun.

**`onPointerMove`:**
```ts
e.preventDefault()
```
`touch-none` CSS darajasida native scroll/pan'ni bloklaydi. `preventDefault()` esa JS darajasida — ayniqsa iOS Safari'ning "rubber-band" overscroll effektiga qarshi ikkinchi qatlamli himoya.

**`MoodCard.vue` — Button:**
```html
<Button type="button" @click.prevent="saveMood(mood)">
```
`type="submit"` bilan forma ichida bo'lmasada ba'zi brauzerlarda submit trigger bo'lishi mumkin. `type="button"` + Vue'ning `.prevent` modifikatori buni butunlay bloklaydi.

---

### 4. Pointer Capture — Drag drag bo'lib qolmasligi

`onPointerDown` ichida `setPointerCapture` chaqiriladi:

```ts
(e.target as HTMLElement).setPointerCapture(e.pointerId)
```

Bu brauzerga "sichqoncha/barmoq qayerda bo'lishidan qat'i nazar, barcha pointer eventlarini men qabul qilaman" degan signal. `onPointerUp` da esa `releasePointerCapture` orqali ozod qilinadi.

Bu bo'lmasa: foydalanuvchi knobdan tezda sichqonchani chiqarib yuborganda drag to'xtamay qolardi va knob "muzlab" qolardi.

---

### 5. Mood History + Streak — `localStorage` bilan persistent holat

`saveMood()` har safar chaqirilganda:
1. Yangi `MoodEntry` ob'ekt yaratiladi (vaqt va sana bilan)
2. `moodHistory` massivining boshiga qo'shiladi (`unshift`)
3. 20 tadan oshsa, eskisi o'chiriladi
4. `localStorage`ga saqlash amalga oshiriladi

`updateStreak()` funksiyasi bugungi sana va oxirgi check-in sanasini solishtirib, ketma-ket kunlarni hisoblab boradi. Agar kecha check-in bo'lgan bo'lsa — streak+1, bo'lmagan bo'lsa — 1 dan qayta boshlanadi.

`MoodHistory.vue` da `stats` computed orqali har bir kayfiyat nechi marta tanlanganini hisoblaydi va maksimal qiymatga nisbatan foizda progress bar ko'rsatadi.

---

### 6. Web Audio API — Synthesis sound effektlar

Tashqi audio fayl ishlatilmagan. Barcha tovushlar `soundEffect.ts` da `AudioContext` va `OscillatorNode` orqali real vaqtda generatsiya qilinadi:

```ts
export function playTone(frequency: number, duration: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}
```

- `tick` — drag boshlanishi/tugashida (600 Hz, qisqa)
- `ding` — kayfiyat saqlanganida (800 Hz, uzunroq)
- `chime` — streak yangilanganda (600 Hz + 900 Hz, ketma-ket)

`isMuted` ref orqali tovush o'chirilishi mumkin va holat `localStorage`da saqlanadi.

---

## Vue-ga xos jihatlar

| Xususiyat | Qo'llanilishi |
|---|---|
| `<script setup>` | Barcha komponentlarda Composition API |
| `ref` / `computed` | Reaktiv holat va derivatsiya |
| `defineProps<T>()` | Typed props (`MoodCard`) |
| `:ref` callback | `container` elementni `HTMLElement` sifatida olish (`MoodBox`) |
| `<Teleport to="body">` | History modal DOM ierarxiyasidan tashqariga chiqarilgan |
| `<Transition name="modal">` | Modal ochilish/yopilish animatsiyasi |
| `@click.self` | Backdrop ustiga bosishda modalni yopish (event delegation) |

---

## `touch-none` — Nima uchun zarur?

`MoodBox.vue` dagi drag maydoniga `touch-none` (Tailwind: `touch-action: none`) klasi qo'shilgan:

```html
<div class="... touch-none" @pointermove="onPointerMove" ...>
```

### `touch-action: none` nima qiladi?

Bu CSS xususiyati brauzerga: **"bu elementdagi barmoq harakatlarini o'zing boshqarma, men boshqaraman"** — deb aytadi.

### Bu bo'lmasа qanday muammolar kelib chiqardi?

**1. Sahifa siljib ketishi (scroll hijacking)**  
Mobil qurilmada foydalanuvchi knobni sudraganida brauzer bir vaqtning o'zida ham drag eventni, ham sahifani scroll qilishga harakat qiladi. Natijada knob o'rniga butun sahifa yuqori-pastga siljib ketadi.

**2. Pointer eventlari uzilishi**  
Brauzer scroll animatsiyasini boshlagan zahoti `pointermove` eventlarini to'xtatib qo'yishi mumkin. Bu inertia mexanizmini buzadi — knob to'satdan muzlab qoladi.

**3. 300ms kechikish (legacy tap delay)**  
Eski mobil brauzerlarda `touch-action` ko'rsatilmasa, brauzer "double-tap to zoom" ehtimolini kutib, 300ms kechikish qo'shadi. Bu drag boshlanishini sezilarli darajada og'irlashtiradi.

**4. `setPointerCapture` ishlamasligi**  
Brauzerning o'z touch gesture handleri ustunlik qilib, `setPointerCapture` effektini bekor qilishi mumkin.

**Xulosa:** `touch-none` olmasa ilova mobil qurilmalarda ishlamasdi — asosiy funksionallik (drag) butunlay buzilgan bo'lardi.

---

## Fayl tuzilmasi

```
src/
├── App.vue                    # Root layout, header, modal
├── components/
│   ├── MoodBox.vue            # 2D drag maydon
│   ├── MoodCard.vue           # Aktiv kayfiyat kartochkasi
│   ├── MoodHistory.vue        # Tarix va statistika
│   ├── store/
│   │   ├── useStore.ts        # Barcha holat va mantiq
│   │   └── soundEffect.ts     # Web Audio synth
│   └── ui/button/             # shadcn-vue Button komponenti
└── style.css                  # Global stillar
```

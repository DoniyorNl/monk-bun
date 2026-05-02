import { ref, computed } from 'vue'
import { sound } from './soundEffect'

export interface MoodColors {
	accent: string
	iconBg: string
	iconText: string
	badge: string
	bar: string
	btn: string
}

export interface Mood {
	key: string
	name: string
	icon: string
	energy: string
	valence: string
	colors: MoodColors
}

export const MOODS: Record<string, Mood> = {
	anxious: {
		key: 'anxious',
		name: 'Anxious',
		icon: '🌀',
		energy: 'High energy',
		valence: 'Unpleasant',
		colors: {
			accent: 'text-violet-600',
			iconBg: 'bg-violet-100',
			iconText: 'text-violet-500',
			badge: 'bg-violet-50 text-violet-600 ring-violet-200/60',
			bar: 'bg-violet-500',
			btn: 'bg-violet-600 hover:bg-violet-700 text-white border-transparent',
		},
	},
	excited: {
		key: 'excited',
		name: 'Excited',
		icon: '⚡',
		energy: 'High energy',
		valence: 'Pleasant',
		colors: {
			accent: 'text-emerald-600',
			iconBg: 'bg-emerald-100',
			iconText: 'text-emerald-500',
			badge: 'bg-emerald-50 text-emerald-600 ring-emerald-200/60',
			bar: 'bg-emerald-500',
			btn: 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent',
		},
	},
	sad: {
		key: 'sad',
		name: 'Sad',
		icon: '🌧',
		energy: 'Low energy',
		valence: 'Unpleasant',
		colors: {
			accent: 'text-red-500',
			iconBg: 'bg-red-100',
			iconText: 'text-red-400',
			badge: 'bg-red-50 text-red-500 ring-red-200/60',
			bar: 'bg-red-400',
			btn: 'bg-red-500 hover:bg-red-600 text-white border-transparent',
		},
	},
	calm: {
		key: 'calm',
		name: 'Calm',
		icon: '🍃',
		energy: 'Low energy',
		valence: 'Pleasant',
		colors: {
			accent: 'text-amber-600',
			iconBg: 'bg-amber-100',
			iconText: 'text-amber-500',
			badge: 'bg-amber-50 text-amber-600 ring-amber-200/60',
			bar: 'bg-amber-400',
			btn: 'bg-amber-500 hover:bg-amber-600 text-white border-transparent',
		},
	},
}

// ─── Mood History ───────────────────────────────────────────────

export interface MoodEntry {
	key: string
	name: string
	icon: string
	time: string
	date: string
}

export const moodHistory = ref<MoodEntry[]>(
	JSON.parse(localStorage.getItem('moodHistory') || '[]')
)

export function saveMood(mood: Mood) {
	haptic.save()
	sound.ding()
	const entry: MoodEntry = {
		key: mood.key,
		name: mood.name,
		icon: mood.icon,
		time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
		date: new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' }),
	}
	//limit to 20 entries
	moodHistory.value.unshift(entry)
	if (moodHistory.value.length > 20) {
		moodHistory.value = moodHistory.value.slice(0, 20)
	}
	localStorage.setItem('moodHistory', JSON.stringify(moodHistory.value))
	updateStreak()
}

// ─── Position & Drag ────────────────────────────────────────────

export const container = ref<HTMLElement | null>(null)
export const pos = ref({ x: 50, y: 50 })

export const activeMood = computed<Mood>(() => {
	const col = pos.value.x > 50 ? 1 : 0
	const row = pos.value.y > 50 ? 1 : 0

	const map: Mood[][] = [
		[MOODS.anxious, MOODS.excited],
		[MOODS.sad, MOODS.calm],
	]

	return map[row][col]
})

const FRICTION = 0.94
const MIN_VELOCITY = 0.05

let velocity = { x: 0, y: 0 }
let dragging = false
let last = { x: 0, y: 0 }
let frame: number | null = null

function clamp(v: number) {
	return Math.max(0, Math.min(100, v))
}

export function onPointerDown(e: PointerEvent) {
	e.preventDefault()
	sound.tick()
	dragging = true
	velocity = { x: 0, y: 0 }
	last = { x: e.clientX, y: e.clientY }
		; (e.target as HTMLElement).setPointerCapture(e.pointerId)
	if (frame) cancelAnimationFrame(frame)
}

export function onPointerMove(e: PointerEvent) {
	e.preventDefault()

	if (!dragging || !container.value) return

	const rect = container.value.getBoundingClientRect()

	velocity.x = ((e.clientX - last.x) / rect.width) * 100
	velocity.y = ((e.clientY - last.y) / rect.height) * 100

	last = { x: e.clientX, y: e.clientY }

	pos.value.x = clamp(pos.value.x + velocity.x)
	pos.value.y = clamp(pos.value.y + velocity.y)
}

export function onPointerUp(e: PointerEvent) {
	sound.tick()
	if (!dragging) return
	dragging = false
		; (e.target as HTMLElement).releasePointerCapture(e.pointerId)
	startInertia()
}

export function startInertia() {
	function animate() {
		pos.value.x = clamp(pos.value.x + velocity.x)
		pos.value.y = clamp(pos.value.y + velocity.y)

		velocity.x *= FRICTION
		velocity.y *= FRICTION

		if (pos.value.x === 0 || pos.value.x === 100) velocity.x *= 0.5
		if (pos.value.y === 0 || pos.value.y === 100) velocity.y *= 0.5

		const stopped =
			Math.abs(velocity.x) < MIN_VELOCITY &&
			Math.abs(velocity.y) < MIN_VELOCITY

		if (!stopped) frame = requestAnimationFrame(animate)
	}

	frame = requestAnimationFrame(animate)
}

// ─── Dark Mode ──────────────────────────────────────────────────

export const isDark = ref(localStorage.getItem('theme') === 'dark')
document.documentElement.classList.toggle('dark', isDark.value)

export function toggleDark() {
	isDark.value = !isDark.value
	document.documentElement.classList.toggle('dark', isDark.value)
	localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// ─── Mute ───────────────────────────────────────────────────────

export const isMuted = ref(localStorage.getItem('muted') === 'true')

export function toggleMute() {
	isMuted.value = !isMuted.value
	localStorage.setItem('muted', String(isMuted.value))
}

// ─── Streak ─────────────────────────────────────────────────────

export const streak = ref(
	JSON.parse(localStorage.getItem('streak') || '{"streak": 0, "lastCheckIn": ""}')
)
export function updateStreak() {
	const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
	const today = new Date().toISOString().split('T')[0]

	if (streak.value.lastCheckIn === today) return
	sound.chime()
	streak.value.streak = streak.value.lastCheckIn === yesterday ? streak.value.streak + 1 : 1
	streak.value.lastCheckIn = today
	localStorage.setItem('streak', JSON.stringify(streak.value))
	sound.ding()
}

// ─── Haptic ─────────────────────────────────────────

function vibrate(pattern: number | number[]) {
	if (navigator.vibrate) navigator.vibrate(pattern)
}

export const haptic = {
	drag: () => vibrate(5),
	save: () => vibrate(15),
	streak: () => vibrate([10, 50, 10]),
}
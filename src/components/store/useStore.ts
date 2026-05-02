import { ref, computed } from 'vue'

export interface Mood {
	key: string
	name: string
	icon: string
	energy: string
	valence: string
}

export const MOODS: Record<string, Mood> = {
	anxious: { key: 'anxious', name: 'Anxious', icon: '🌀', energy: 'High energy', valence: 'Unpleasant' },
	excited: { key: 'excited', name: 'Excited', icon: '⚡', energy: 'High energy', valence: 'Pleasant' },
	sad:     { key: 'sad',     name: 'Sad',     icon: '🌧', energy: 'Low energy',  valence: 'Unpleasant' },
	calm:    { key: 'calm',    name: 'Calm',    icon: '🍃', energy: 'Low energy',  valence: 'Pleasant' },
}

export const container = ref<HTMLElement | null>(null)
export const pos = ref({ x: 50, y: 50 })

// pos koordinatasidan to'g'ridan mood hisoblanadi — DOM'ga bog'liq emas
export const activeMood = computed<Mood>(() => {
	const col = pos.value.x > 50 ? 1 : 0  // 0=chap, 1=o'ng
	const row = pos.value.y > 50 ? 1 : 0  // 0=yuqori, 1=pastki

	//        chap(0)      o'ng(1)
	// top(0)  anxious     excited
	// bot(1)  sad         calm
	const map: Mood[][] = [
		[MOODS.anxious, MOODS.excited],
		[MOODS.sad,     MOODS.calm],
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
	dragging = true
	velocity = { x: 0, y: 0 }
	last = { x: e.clientX, y: e.clientY }
	;(e.target as HTMLElement).setPointerCapture(e.pointerId)

	if (frame) cancelAnimationFrame(frame)
}

export function onPointerMove(e: PointerEvent) {
	if (!dragging || !container.value) return

	const rect = container.value.getBoundingClientRect()

	const dx = e.clientX - last.x
	const dy = e.clientY - last.y

	last = { x: e.clientX, y: e.clientY }

	velocity.x = (dx / rect.width) * 100
	velocity.y = (dy / rect.height) * 100

	pos.value.x = clamp(pos.value.x + velocity.x)
	pos.value.y = clamp(pos.value.y + velocity.y)
}

export function onPointerUp(e: PointerEvent) {
	if (!dragging) return
	dragging = false
	;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
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

		if (stopped) return

		frame = requestAnimationFrame(animate)
	}

	frame = requestAnimationFrame(animate)
}

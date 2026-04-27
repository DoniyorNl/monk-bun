<script setup lang="ts">
import { ref } from 'vue'

const container = ref<HTMLElement | null>(null)

const pos = ref({ x: 50, y: 50 })
let velocity = { x: 0, y: 0 }

let dragging = false
let last = { x: 0, y: 0 }
let frame: number | null = null

const FRICTION = 0.94
const MIN_VELOCITY = 0.05

function clamp(v: number) {
	return Math.max(0, Math.min(100, v))
}

function onPointerDown(e: PointerEvent) {
	dragging = true
	velocity = { x: 0, y: 0 }
	last = { x: e.clientX, y: e.clientY }
	;(e.target as HTMLElement).setPointerCapture(e.pointerId)

	if (frame) {
		cancelAnimationFrame(frame)
	}
}

function onPointerMove(e: PointerEvent) {
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

function onPointerUp(e: PointerEvent) {
	if (!dragging) return
	dragging = false
	;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
	startInertia()
}

function startInertia() {
	function animate() {
		pos.value.x = clamp(pos.value.x + velocity.x)
		pos.value.y = clamp(pos.value.y + velocity.y)

		velocity.x *= FRICTION
		velocity.y *= FRICTION

		// edge resistance
		if (pos.value.x === 0 || pos.value.x === 100) velocity.x *= 0.5
		if (pos.value.y === 0 || pos.value.y === 100) velocity.y *= 0.5

		if (Math.abs(velocity.x) < MIN_VELOCITY && Math.abs(velocity.y) < MIN_VELOCITY) {
			const col = pos.value.x > 50 ? 1 : 0 // 0=chap, 1=o'ng
			const row = pos.value.y > 50 ? 1 : 0 // 0=yuqori, 1=pastki
			const index = row * 2 + col // 0,1,2,3

			const cells = container.value!.querySelectorAll('.grid > div')
			const el = cells[index]
			console.log(el) // elemtn ushlab olindi bu drag knob to'xtagan tag
			return
		}

		frame = requestAnimationFrame(animate)
	}

	frame = requestAnimationFrame(animate)
}
</script>

<template>
	<div class="flex justify-center items-center bg-amber-50 rounded-3xl">
		<div
			ref="container"
			class="relative w-[320px] h-[320px] rounded-3xl overflow-hidden shadow-lg select-none"
			@pointermove="onPointerMove"
			@pointerup="onPointerUp"
			@pointerleave="onPointerUp"
		>
			<div class="grid grid-cols-2 grid-rows-2 w-full h-full rounded-xl overflow-hidden shadow-lg">
				<div
					class="flex items-center justify-center"
					style="background: radial-gradient(circle at bottom right, #f3e8ff 0%, #9333ea 120%)"
				>
					<span class="bg-white/80 px-3 py-1 rounded-md text-sm font-medium text-gray-800 shadow-sm"
						>Anxious</span
					>
				</div>

				<div
					class="flex items-center justify-center"
					style="background: radial-gradient(circle at bottom left, #ffedd5 0%, #ea580c 120%)"
				>
					<span class="bg-white/80 px-3 py-1 rounded-md text-sm font-medium text-gray-800 shadow-sm"
						>Excited</span
					>
				</div>

				<div
					class="flex items-center justify-center"
					style="background: radial-gradient(circle at top right, #fee2e2 0%, #dc2626 120%)"
				>
					<span class="bg-white/80 px-3 py-1 rounded-md text-sm font-medium text-gray-800 shadow-sm"
						>Sad</span
					>
				</div>

				<div
					class="flex items-center justify-center"
					style="background: radial-gradient(circle at top left, #fefce8 0%, #ca8a04 120%)"
				>
					<span class="bg-white/80 px-3 py-1 rounded-md text-sm font-medium text-gray-800 shadow-sm"
						>Calm</span
					>
				</div>
			</div>

			<!-- CROSS -->
			<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div class="w-full h-[1px] bg-white/50"></div>
				<div class="absolute h-full w-[1px] bg-white/50"></div>
			</div>

			<!-- DRAG KNOB -->
			<div
				class="absolute w-6 h-6 bg-white border-4 border-purple-500 rounded-full shadow-md cursor-pointer transition-transform duration-150 hover:scale-125 active:scale-110"
				:style="{
					left: pos.x + '%',
					top: pos.y + '%',
					transform: 'translate(-50%, -50%)',
				}"
				@pointerdown="onPointerDown"
			/>
		</div>
	</div>
</template>

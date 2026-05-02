<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { container, onPointerDown, onPointerMove, onPointerUp, pos } from './store/useStore'

function setContainer(el: Element | ComponentPublicInstance | null) {
	if (el instanceof HTMLElement) container.value = el
}
</script>

<template>
	<div class="rounded-[28px] bg-white dark:bg-[#26263d84] p-2 shadow-[0_2px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.5)] ring-1 ring-black/5 dark:ring-white/8 transition-colors duration-300">
		<div
			:ref="setContainer"
			class="relative h-[300px] w-[300px] overflow-hidden rounded-[20px] select-none touch-none"
			@pointermove="onPointerMove"
			@pointerup="onPointerUp"
			@pointerleave="onPointerUp"
		>
			<!-- quadrant grid -->
			<div class="grid h-full w-full grid-cols-2 grid-rows-2">
				<div
					class="relative flex items-start justify-start p-3"
					style="background: radial-gradient(circle at bottom right, #ede9fe 0%, #c4b5fd 100%)"
				>
					<span class="text-[11px] font-semibold tracking-wide text-violet-600/80">Anxious</span>
				</div>

				<div
					class="relative flex items-start justify-end p-3"
					style="background: radial-gradient(circle at bottom left, #dcfce7 0%, #4ade80 100%)"
				>
					<span class="text-[11px] font-semibold tracking-wide text-emerald-600/80">Excited</span>
				</div>

				<div
					class="relative flex items-end justify-start p-3"
					style="background: radial-gradient(circle at top right, #fee2e2 0%, #fca5a5 100%)"
				>
					<span class="text-[11px] font-semibold tracking-wide text-red-500/80">Sad</span>
				</div>

				<div
					class="relative flex items-end justify-end p-3"
					style="background: radial-gradient(circle at top left, #fef9c3 0%, #fde68a 100%)"
				>
					<span class="text-[11px] font-semibold tracking-wide text-amber-600/80">Calm</span>
				</div>
			</div>

			<!-- axis lines -->
			<div class="pointer-events-none absolute inset-0">
				<div class="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white/60"></div>
				<div class="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-white/60"></div>
			</div>

			<!-- drag knob -->
			<div
				class="absolute h-5 w-5 cursor-grab rounded-full bg-white dark:bg-[#e2e2f0] shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-2 ring-black/20 dark:ring-white/20 transition-transform duration-100 active:cursor-grabbing active:scale-110"
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

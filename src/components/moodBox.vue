<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onPointerDown, onPointerMove, onPointerUp, pos, container } from './store/useStore'

const containerEl = ref<HTMLElement | null>(null)

onMounted(() => {
	container.value = containerEl.value
})
</script>

<template>
	<div class="flex justify-center items-center bg-amber-50 rounded-3xl">
		<div
			ref="containerEl"
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

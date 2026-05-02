<script setup lang="ts">
import { saveMood, type Mood } from './store/useStore'
import { Button } from './ui/button'

defineProps<{ mood: Mood }>()
</script>

<template>
	<div
		class="w-[304px] overflow-hidden rounded-[24px] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-all duration-500"
	>
		<!-- colored top bar -->
		<div class="h-1 w-full transition-colors duration-500" :class="mood.colors.bar" />

		<div class="p-4">
			<!-- icon + label -->
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-colors duration-500"
					:class="[mood.colors.iconBg, mood.colors.iconText]"
				>
					{{ mood.icon }}
				</div>

				<div>
					<p class="text-[10px] font-semibold tracking-[0.18em] text-gray-400 uppercase">
						I'm feeling
					</p>
					<p
						class="text-xl font-semibold leading-tight tracking-tight transition-colors duration-500"
						:class="mood.colors.accent"
					>
						{{ mood.name }}
					</p>
				</div>
			</div>

			<!-- badges -->
			<div class="mt-3 flex gap-2">
				<span
					class="rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors duration-500"
					:class="mood.colors.badge"
				>
					{{ mood.energy }}
				</span>
				<span
					class="rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors duration-500"
					:class="mood.colors.badge"
				>
					{{ mood.valence }}
				</span>
			</div>

			<!-- save button -->
			<Button
				type="submit"
				class="mt-3 h-9 w-full rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-500"
				:class="mood.colors.btn"
				@click="saveMood(mood)"
			>
				Save Mood
			</Button>
		</div>
	</div>
</template>

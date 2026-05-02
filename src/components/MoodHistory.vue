<script setup lang="ts">
import { computed } from 'vue'
import { moodHistory, MOODS } from './store/useStore'

// har mood necha marta tanlangani
const stats = computed(() => {
	const counts: Record<string, number> = {
		anxious: 0,
		excited: 0,
		sad: 0,
		calm: 0,
	}

	moodHistory.value.forEach(entry => {
		if (counts[entry.key] !== undefined) counts[entry.key]++
	})

	const max = Math.max(...Object.values(counts), 1)

	return Object.entries(counts).map(([key, count]) => ({
		mood: MOODS[key],
		count,
		percent: Math.round((count / max) * 100),
	}))
})

// oxirgi 7 ta entry
const recent = computed(() => moodHistory.value.slice(0, 7))
</script>

<template>
	<div class="px-5 py-4 space-y-6">
		<!-- bo'sh holat -->
		<div v-if="moodHistory.length === 0" class="flex flex-col items-center py-8 gap-2">
			<span class="text-3xl">🌱</span>
			<p class="text-gray-500 text-sm">No check-ins yet</p>
		</div>

		<template v-else>
			<!-- Frequency chart -->
			<div>
				<p class="text-[10px] font-semibold tracking-[0.15em] text-gray-500 uppercase mb-3">
					Frequency
				</p>
				<div class="space-y-2.5">
					<div
						v-for="{ mood, count, percent } in stats"
						:key="mood.key"
						class="flex items-center gap-3"
					>
						<span class="text-base w-5 text-center">{{ mood.icon }}</span>
						<div class="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full transition-all duration-700"
								:class="mood.colors.bar"
								:style="{ width: percent + '%' }"
							/>
						</div>
						<span class="text-[11px] text-gray-500 w-4 text-right">{{ count }}</span>
					</div>
				</div>
			</div>

			<!-- divider -->
			<div class="h-px bg-white/6" />

			<!-- Recent entries -->
			<div>
				<p class="text-[10px] font-semibold tracking-[0.15em] text-gray-500 uppercase mb-3">
					Recent
				</p>
				<div class="space-y-2">
					<div
						v-for="(entry, i) in recent"
						:key="i"
						class="flex items-center justify-between rounded-xl bg-white/4 px-3 py-2.5"
					>
						<div class="flex items-center gap-2.5">
							<span class="text-base">{{ entry.icon }}</span>
							<span class="text-white/80 text-sm font-medium">{{ entry.name }}</span>
						</div>
						<div class="text-right">
							<p class="text-[11px] text-gray-500">{{ entry.time }}</p>
							<p class="text-[10px] text-gray-600">{{ entry.date }}</p>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import MoodCard from '@/components/MoodCard.vue'
import MoodBox from '@/components/MoodBox.vue'
import { Button } from '@/components/ui/button'
import { History, X } from 'lucide-vue-next'
import { activeMood } from '@/components/store/useStore'
import MoodHistory from '@/components/MoodHistory.vue'
import { ref } from 'vue'

const showHistory = ref(false)
</script>

<template>
	<div class="flex h-screen flex-col overflow-hidden bg-[#f7f6f3]">
		<header class="flex items-center justify-between border-b border-black/6 px-6 py-4">
			<span class="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase">Monk</span>
			<Button
				variant="outline"
				size="sm"
				class="rounded-full text-[11px] text-gray-500"
				@click="showHistory = true"
			>
				<History class="size-3.5!" />
				History
			</Button>
		</header>

		<main class="flex flex-1 flex-col items-center justify-center gap-8 px-4">
			<div class="text-center">
				<p class="mb-1.5 text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
					Daily check-in
				</p>
				<h1 class="text-[28px] font-semibold tracking-tight text-gray-900">How are you feeling?</h1>
			</div>

			<MoodBox />
			<MoodCard :mood="activeMood" />
		</main>
	</div>

	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="showHistory"
				class="fixed inset-0 z-50 flex items-center justify-center p-4"
				@click.self="showHistory = false"
			>
				<!-- backdrop -->
				<div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="showHistory = false" />

				<!-- modal -->
				<div
					class="relative w-full max-w-sm rounded-3xl bg-[#0f0f1a] border border-white/8 shadow-2xl overflow-hidden"
				>
					<!-- header -->
					<div class="flex items-center justify-between px-5 py-4 border-b border-white/6">
						<div>
							<h3 class="text-white font-semibold text-sm">Mood History</h3>
							<p class="text-gray-500 text-[11px] mt-0.5">Last 30 check-ins</p>
						</div>
						<button
							class="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all duration-200"
							@click="showHistory = false"
						>
							<X class="size-3.5" />
						</button>
					</div>

					<!-- scrollable content -->
					<div class="overflow-y-auto max-h-[60vh] mood-scroll">
						<MoodHistory />
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

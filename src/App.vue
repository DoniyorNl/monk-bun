<script setup lang="ts">
import moodBox from '@/components/moodBox.vue'
import MoodCard from '@/components/MoodCard.vue'
import { ref } from 'vue'

const moods = {
	calm: { key: 'calm', name: 'Calm', icon: '🍃', energy: 'Low energy', valence: 'Pleasant' },
	excited: {
		key: 'excited',
		name: 'Excited',
		icon: '⚡',
		energy: 'High energy',
		valence: 'Pleasant',
	},
	anxious: {
		key: 'anxious',
		name: 'Anxious',
		icon: '🌀',
		energy: 'High energy',
		valence: 'Unpleasant',
	},
	sad: { key: 'sad', name: 'Sad', icon: '🌧', energy: 'Low energy', valence: 'Unpleasant' },
}

const selectedMood = ref(moods.calm)


</script>

<template>
	<div class="min-h-screen flex flex-col items-center justify-center gap-4">
		<h1>How are you feeling right now?</h1>
		<moodBox />
		<MoodCard :mood="selectedMood" />
	</div>
</template>

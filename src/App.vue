<script setup lang="ts">
import MoodBox from './components/moodBox.vue'
import MoodCard from '@/components/MoodCard.vue'
import { activeMood } from './components/store/useStore'
</script>

<template>
	<div class="min-h-screen flex flex-col items-center justify-center gap-4">
		<h1>How are you feeling right now?</h1>
		<MoodBox />
		<MoodCard :mood="activeMood" />
	</div>
</template>

<script setup>
import Button from './ui/button/Button.vue'

defineProps({
	mood: {
		type: Object,
		required: true,
		// { key, name, icon, energy, valence }
	},
})
</script>
<!-- MoodCard.vue -->
<template>
	<div class="mood-card" :class="mood.key">
		<span class="mood-icon">{{ mood.icon }}</span>
		<div>
			<div class="mood-label">I'm feeling</div>
			<div class="mood-name">{{ mood.name }}</div>
			<div class="mood-tags">
				<span class="mood-tag">{{ mood.energy }}</span>
				<span class="mood-tag">{{ mood.valence }}</span>
			</div>
		</div>
		<Button variant="outline" type="submit"> Save Mood </Button>
	</div>
</template>

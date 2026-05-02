let audioCtx: AudioContext | null = null

export function getAudioContext() {
	if (!audioCtx) audioCtx = new AudioContext()
	return audioCtx
}

export const sound = {
	tick: () => playTone(600, 0.05),
	ding: () => playTone(800, 0.3),
	chime: () => {
		playTone(600, 0.2)
		setTimeout(() => playTone(900, 0.3), 150)
	}
}

export function playTone(frequency: number, duration: number) {
	const ctx = getAudioContext()
	const osc = ctx.createOscillator()
	const gain = ctx.createGain()

	osc.connect(gain)
	gain.connect(ctx.destination)

	osc.type = 'sine'
	osc.frequency.setValueAtTime(frequency, ctx.currentTime)

	gain.gain.setValueAtTime(0.3, ctx.currentTime)
	gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

	osc.start(ctx.currentTime)
	osc.stop(ctx.currentTime + duration)
}




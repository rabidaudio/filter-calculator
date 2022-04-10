<script>
  import { log10, range, pow, pi } from 'mathjs'

  import { hertz, unitless } from './units'

  import UnitInput from './UnitInput.svelte'
  import Chart from './Chart.svelte'

  export let start = hertz('20 Hz')
  export let end = hertz('20 kHz')
  export let stepsPerDecade = 100

  export let transferFunction

  let f,
    h,
    magnitude,
    phase = []
  let data = {}
  $: {
    f = transferFunction
      ? range(log10(start.value), log10(end.value), 1 / stepsPerDecade)
          .toArray()
          .map((x) => pow(10, x))
      : []
    h = transferFunction ? f.map(transferFunction) : []
    magnitude = h.map((c) => 10 * log10(c.toPolar().r)) // dB
    phase = h.map((c) => (360 * c.toPolar().phi) / (2 * pi)) // degrees
    data = {
      labels: f.map((f) => hertz(f).format({ precision: 2 })),
      datasets: [
        {
          label: 'Magnitude (dB)',
          data: magnitude,
          backgroundColor: 'blue',
          yAxisID: 'magnitude',
        },
        {
          label: 'Phase (degrees)',
          data: phase,
          backgroundColor: 'green',
          yAxisID: 'phase',
        },
      ],
    }
  }

  const options = {
    responsive: true,
    scales: {
      magnitude: {
        type: 'linear',
        position: 'left',
      },
      phase: {
        type: 'linear',
        position: 'right',
      },
    },
  }
</script>

<div>
  {#if transferFunction}
    <Chart type="line" data="{data}" options="{options}" updateMode="none" />
  {/if}
</div>

<UnitInput name="start" bind:value="{start}" unitFn="{hertz}" />
<UnitInput name="end" bind:value="{end}" unitFn="{hertz}" />

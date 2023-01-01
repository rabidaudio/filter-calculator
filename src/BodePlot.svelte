<script>
  import { hertz } from './units'

  import UnitInput from './UnitInput.svelte'
  import Chart from './Chart.svelte'
  import { plot } from './calculator'

  export let start = hertz('20 Hz')
  export let end = hertz('20 kHz')
  export let stepsPerDecade = 100

  export let transferFunction

  let labels,
    magnitude,
    phase = []
  let data = {}

  $: if (transferFunction) {
    ;({ labels, magnitude, phase } = plot(transferFunction, start, end, stepsPerDecade))
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

  $: data = {
    labels,
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
</script>

{#if transferFunction}
  <div>
    <Chart type="line" {data} {options} updateMode="none" />
  </div>
  <UnitInput name="start" bind:value={start} unitFn={hertz} />
  <UnitInput name="end" bind:value={end} unitFn={hertz} />
{/if}

<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte'
  import { Chart, registerables } from 'chart.js/dist/chart.esm'
  Chart.register(...registerables)
  //  Expected data
  export let data = {
    labels: [],
    datasets: [{ data: [] }],
    yMarkers: {},
    yRegions: [],
  }
  export let type = 'line'
  export let options = {}
  export let plugins = []
  export let updateMode = null
  let chart = null
  let chartRef

  onMount(() => {
    chart = new Chart(chartRef, {
      type,
      data,
      options,
      plugins,
    })
  })
  afterUpdate(() => {
    if (!chart) return
    chart.data = data
    chart.type = type
    chart.options = options
    chart.plugins = plugins
    chart.update(updateMode)
  })
  onDestroy(() => {
    if (chart) chart.destroy()
    chart = null
  })
</script>

<canvas bind:this="{chartRef}" data="{data}" type="{type}" options="{options}" plugins="{plugins}">
</canvas>

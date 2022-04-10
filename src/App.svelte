<script>
  import Resonance from './Resonance.svelte'

  import { getCalculator } from './calculator'
  import UnitInput from './UnitInput.svelte'
  import { farads, ohms, hertz } from './units'
  import BodePlot from './BodePlot.svelte'
  import Order from './Order.svelte'

  let order = 2
  let type = 'lowpass'
  let cutoff = hertz('1 kHz')
  let q
  // let lastChanged = 'r1'

  $: calculator = getCalculator(order, type)
  $: components = q ? calculator.solve(cutoff, q, components) : []
</script>

<style>
  main {
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <Order bind:order bind:type />

  <img src="{calculator.layoutURL}" alt="schematic" />

  <label for="cutoff">Cut-off frequency</label>
  <UnitInput bind:value="{cutoff}" unitFn="{hertz}" name="cutoff" placeholder="1kHz" />
  <Resonance bind:q />

  {#each components as component}
    <label for="{component.name}">{component.name.toUpperCase()}</label>
    <UnitInput
      name="{component.name}"
      bind:value="{component.value}"
      unitFn="{component === 'r' ? ohms : farads}"
    />
  {/each}

  <!-- on:focus="{() => (lastChanged = 'r1')}"
on:focus="{() => (lastChanged = 'r2')}"
on:focus="{() => (lastChanged = 'c1')}"
on:focus="{() => (lastChanged = 'c2')}" -->

  <BodePlot transferFunction="{calculator.transferFunction(components)}" />
</main>

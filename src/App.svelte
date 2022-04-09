<script>
  import Resonance from './Resonance.svelte'

  import { SecondOrderLowPassSallenKey } from './calculator'
  import UnitInput from './UnitInput.svelte'
  import { farads, ohms, hertz, unitless } from './units'

  let cutoff = hertz(1000)
  let q
  let results = {}
  let lastChanged = 'r1'

  const calculator = new SecondOrderLowPassSallenKey()

  $: if (q && cutoff) {
    results = calculator.solve(cutoff, q, results, lastChanged)
  }
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
  <label for="cutoff">Cut-off frequency</label>
  <UnitInput bind:value="{cutoff}" unitFn="{hertz}" name="cutoff" placeholder="1kHz" />
  <Resonance bind:q />

  <label for="r1">R1</label>
  <UnitInput
    name="r1"
    bind:value="{results.r1}"
    unitFn="{ohms}"
    on:focus="{() => (lastChanged = 'r1')}"
  />
  <label for="r2">R2</label>
  <UnitInput
    name="r2"
    bind:value="{results.r2}"
    unitFn="{ohms}"
    on:focus="{() => (lastChanged = 'r2')}"
  />
  <label for="c1">C1</label>
  <UnitInput
    name="c1"
    bind:value="{results.c1}"
    unitFn="{farads}"
    on:focus="{() => (lastChanged = 'c1')}"
  />
  <label for="c2">C2</label>
  <UnitInput
    name="c2"
    bind:value="{results.c2}"
    unitFn="{farads}"
    on:focus="{() => (lastChanged = 'c2')}"
  />
</main>

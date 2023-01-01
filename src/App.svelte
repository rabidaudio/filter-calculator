<script>
  import Resonance from './Resonance.svelte'

  import { getCalculator, LowPassSallenKey } from './calculator'
  import UnitInput from './UnitInput.svelte'
  import { farads, ohms, hertz } from './units'
  import BodePlot from './BodePlot.svelte'
  import Order from './Order.svelte'

  let order = 2
  let type = 'lowpass'
  let active = true
  let cutoff = hertz('1 kHz')
  let q
  // let lastChanged = 'r1'

  $: calculator = getCalculator(order, type, active)
  $: components = calculator && q ? calculator.solve(cutoff, q, components) : []

  let lockedComponents = new Set()
  function updateLockedComponents(name, locked) {
    lockedComponents.delete(name)
    if (locked) lockedComponents.add(name)
    for (let component of components) {
      if (lockedComponents.size === order) break
      if (lockedComponents.size > order) lockedComponents.delete(component.name)
      if (lockedComponents.size < order) lockedComponents.add(component.name)
    }
    for (let component of components) {
      component.locked = lockedComponents.has(component.name)
    }
    console.log(
      lockedComponents,
      components.map((c) => [c.name, c.locked]),
    )
  }
  $: lockedComponents = components.reduce((s, c) => {
    if (c.locked) s.add(c.name)
    return s
  }, new Set())

  const t = new LowPassSallenKey(q, cutoff)
  console.log(t.components)
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
  <Order bind:order bind:type bind:active />

  {#if !calculator}
    <p style:color="red">This filter has not yet been implemented.</p>
  {:else}
    <img src={calculator.layoutURL} alt="schematic" />

    <label for="cutoff">Cut-off frequency</label>
    <UnitInput bind:value={cutoff} unitFn={hertz} name="cutoff" placeholder="1kHz" />
    <Resonance bind:q />

    {#each components as component}
      <label for={component.name}>{component.name.toUpperCase()}</label>
      <UnitInput
        name="{component.name}[value]"
        bind:value={component.value}
        unitFn={component === 'r' ? ohms : farads}
      />
      <input
        type="checkbox"
        name="{component.name}[locked]"
        checked={component.locked}
        on:change={(e) => updateLockedComponents(component.name, e.target.checked)}
      />
    {/each}

    <!-- on:focus="{() => (lastChanged = 'r1')}"
  on:focus="{() => (lastChanged = 'r2')}"
  on:focus="{() => (lastChanged = 'c1')}"
  on:focus="{() => (lastChanged = 'c2')}" -->

    <BodePlot transferFunction={calculator.transferFunction(components)} />
  {/if}
</main>

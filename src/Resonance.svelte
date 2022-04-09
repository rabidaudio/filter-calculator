<script>
  import UnitInput from './UnitInput.svelte'
  import { unitless } from './units'

  export let q
  let qSelect = q ? 'custom' : 'butterworth'

  $: switch (qSelect) {
    case 'butterworth':
      q = unitless(1 / Math.sqrt(2))
      break
  }
</script>

<label for="q">Q (Resonance)</label>
<select name="q-select" bind:value="{qSelect}">
  <option value="butterworth">Butterworth</option>
  <!-- <option value="chebyshev">Chebyshev</option> -->
  <!-- https://en.wikipedia.org/wiki/Chebyshev_filter -->
  <!-- https://en.wikipedia.org/wiki/Elliptic_filter -->
  <option value="custom">Custom</option>
</select>

{#if qSelect == 'custom'}
  <UnitInput name="q" bind:value="{q}" unitFn="{unitless}" />
{/if}

<p>
  {#if qSelect == 'butterworth'}
    A butterworth filter has a maximally flat passband.
  {/if}
</p>

<script>
  import UnitInput from './UnitInput.svelte'
  import { unitless } from './units'

  export let q
  // export let epsilon = unitless(0.5)
  let qSelect = q ? 'custom' : 'butterworth'

  $: switch (qSelect) {
    case 'butterworth':
      q = unitless(1 / Math.sqrt(2))
      break
    case 'bessel':
      q = unitless(1 / Math.sqrt(3))
      break
    case 'linkwitz–riley':
      q = unitless(0.5)
      break
  }
</script>

<label for="q">Q (Resonance)</label>
<select name="q-select" bind:value={qSelect}>
  <option value="butterworth">Butterworth</option>
  <option value="bessel">Bessel</option>
  <option value="linkwitz–riley">Linkwitz–Riley (L-R)</option>
  <!-- <option value="chebyshev">Chebyshev</option> -->
  <!-- https://en.wikipedia.org/wiki/Chebyshev_filter -->
  <!-- https://en.wikipedia.org/wiki/Elliptic_filter -->
  <!-- https://en.wikipedia.org/wiki/Linkwitz%E2%80%93Riley_filter -->
  <option value="custom">Custom</option>
</select>

{#if qSelect == 'custom'}
  <UnitInput name="q" bind:value={q} unitFn={unitless} />
  <!-- {:else if qSelect == 'chebyshev'}
  <label for="epsilon">Ripple factor (epsilon)</label>
  <UnitInput name="epsilon" bind:value="{epsilon}" unitFn="{unitless}" /> -->
{/if}

<p>
  {#if qSelect == 'butterworth'}
    A Butterworth filter has a maximally flat passband.
  {:else if qSelect == 'bessel'}
    A Bessel filter is a filter with a maximally flat group/phase delay (maximally linear phase
    response), which preserves the wave shape of filtered signals in the passband.
  {:else if qSelect == 'linkwitz–riley'}
    A Linkwitz–Riley (L-R) filter is used in audio crossovers, as upon summing the low-pass and
    high-pass outputs, the gain at the crossover frequency will be 0 dB, so the crossover behaves
    like an all-pass filter, having a flat amplitude response with a smoothly changing phase
    response.
  {:else if qSelect == 'chebyshev'}
    A Chebyshev filter minimizes the error between the idealized and the actual filter
    characteristic over the range of the filter, but with ripples in the passband.
  {/if}
</p>

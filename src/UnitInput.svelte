<script>
  import { createEventDispatcher } from 'svelte'

  export let unitFn
  export let value
  export let name = null
  export let placeholder = null
  export let formatOpts = { precision: 4 }

  const dispatch = createEventDispatcher()

  let displayValue = value && value.format(formatOpts)
  var changing = false
  let error = null

  $: try {
    error = null
    if (changing) {
      // use displayValue to update value
      const newValue = displayValue && unitFn(displayValue)
      if (displayValue && newValue.value !== value.value) {
        value = newValue
      }
    } else {
      // use value to update displayValue
      const newDisplayValue = value && value.format(formatOpts)
      if (newDisplayValue && displayValue !== newDisplayValue) {
        displayValue = newDisplayValue
      }
    }
  } catch (e) {
    error = `invalid: ${e.message}`
  }

  // if (value) {
  //   if (changing) {
  //     try {
  //       const calc = unitFn(displayValue)
  //       if (value != calc) {
  //         value = calc
  //       }
  //       error = null
  //     }
  //   } else {
  //     if (displayValue !== value.format(formatOpts)) {
  //       displayValue = value.format(formatOpts)
  //     }
  //   }
  // }
</script>

<style>
  .error {
    color: red;
  }
</style>

{#if value}
  <input
    type="text"
    bind:value={displayValue}
    on:focus={(e) => {
      changing = true
      dispatch('focus', e)
    }}
    on:blur={(e) => {
      changing = false
      dispatch('blur', e)
    }}
    {name}
    {placeholder}
  />

  {#if error}
    <span class="error">{error}</span>
  {/if}
{/if}

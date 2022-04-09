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

  $: if (changing) {
    try {
      if (displayValue) {
        value = unitFn(displayValue)
        error = null
      }
    } catch (e) {
      error = `invalid: ${e.message}`
    }
  } else {
    displayValue = value && value.format(formatOpts)
  }
</script>

<style>
  .error {
    color: red;
  }
</style>

{#if value}
  <input
    type="text"
    bind:value="{displayValue}"
    on:focus="{(e) => {
      changing = true
      dispatch('focus', e)
    }}"
    on:blur="{(e) => {
      changing = false
      dispatch('blur', e)
    }}"
    name="{name}"
    placeholder="{placeholder}"
  />

  {#if error}
    <span class="error">{error}</span>
  {/if}
{/if}

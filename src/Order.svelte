<script>
  export let order = 2
  export let active = true

  let type = 'active'

  $: active = type == 'active'
</script>

<div>
  <label for="order">Order</label>
  <input type="text" on:change="{(e) => (order = parseInt(e.target.value, 10))}" value="{order}" />
</div>

<div>
  <input type="radio" name="type" bind:group="{type}" value="active" />
  <label for="type">Active</label>
  <input type="radio" name="type" bind:group="{type}" value="passive" />
  <label for="type">Passive</label>
</div>

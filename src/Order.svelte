<script>
  export let order = 2
  export let type = 'lowpass'
  // export let active = true
</script>

<div>
  <label for="order">Order</label>
  <input type="text" value="{order}" />
</div>

<input type="radio" name="type" bind:group="{type}" value="lowpass" />
<label for="type">Low Pass</label>
<input type="radio" name="type" bind:group="{type}" value="highpass" />
<label for="type">High Pass</label>
<input type="radio" name="type" bind:group="{type}" value="bandpass" />
<label for="type">Band Pass</label>

<!-- <div>
  <input type="radio" name="type" bind:group="{type}" value="active" />
  <label for="type">Active</label>
  <input type="radio" name="type" bind:group="{type}" value="passive" />
  <label for="type">Passive</label>
</div> -->

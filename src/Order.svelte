<script>
  export let order
  export let type

  export let active
  let activeValue = active ? 'active' : 'passive'

  $: active = activeValue == 'active'
</script>

<style>
  label {
    display: inline;
  }

  .form-group {
    margin: 10px;
  }
</style>

<div class="form-group">
  <label for="order">Order: {order}</label>
  <input type="range" min="1" max="8" bind:value={order} name="order" />
</div>

<div class="form-group">
  <div>
    <input type="radio" name="type" bind:group={type} value="lowpass" />
    <label for="type">Lowpass</label>
  </div>
  <div>
    <input type="radio" name="type" bind:group={type} value="highpass" />
    <label for="type">Highpass</label>
  </div>
  {#if order >= 2}
    <div>
      <input type="radio" name="type" bind:group={type} value="bandpass" />
      <label for="type">Bandpass</label>
    </div>
    <div>
      <input type="radio" name="type" bind:group={type} value="notch" />
      <label for="type">Notch</label>
    </div>
    <div>
      <input type="radio" name="type" bind:group={type} value="allpass" />
      <label for="type">Allpass</label>
    </div>
  {/if}
</div>

<div class="form-group">
  <div>
    <input type="radio" name="active" bind:group={activeValue} value="active" />
    <label for="active">Active</label>
  </div>
  <div>
    <input type="radio" name="active" bind:group={activeValue} value="passive" />
    <label for="active">Passive</label>
  </div>
</div>

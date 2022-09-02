<script>
	let count = 0;
</script>

<div>
  <h2>Svelte Counter {count}</h2>
  <button on:click={() => count += 1}>
    Increment
  </button>
</div>
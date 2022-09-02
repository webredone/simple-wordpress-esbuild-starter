import React from 'react';
import { createRoot } from 'react-dom/client';
import { Counter as ReactCounter } from './react/Counter';

// ---
import { createApp } from 'vue';
import VueCounter from './vue/Counter.vue';
// ---

//---
import SvelteCounter from './svelte/Counter.svelte';
//---

// APP WRAPS SELECTORS
const reactWrap = document.querySelector('#root-react');
const vueWrap = document.querySelector('#root-vue');
const svelteWrap = document.querySelector('#root-svelte');

// ---
// INIT REACT APP
const root = createRoot(reactWrap);
root.render(<ReactCounter />);
// ---

// ---
// INIT VUE APP
const vueApp = createApp(VueCounter);
vueApp.mount(vueWrap);
// ---

// ---
// INIT SVELTE APP
new SvelteCounter({
  target: svelteWrap,
});
// ---

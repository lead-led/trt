/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare global {
	interface Window {
		electron: any;
	}
}

export {};

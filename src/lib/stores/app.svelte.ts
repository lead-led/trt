/// <reference types="svelte" />

export type TextAlignment = 'left' | 'center' | 'end';

export type AppState = {
	isSettingsOpen: boolean;
	textAlignment: TextAlignment;
	isTextOnTop: boolean;
	labelFontSize: number;
	timeFontSize: number;
	isEditingFormat: boolean;
	isDev: boolean;
};

const state: AppState = $state({
	isSettingsOpen: true,
	textAlignment: 'left',
	isTextOnTop: true,
	labelFontSize: 50,
	timeFontSize: 100,
	isEditingFormat: false,
	isDev: false,
});

export const appState = state;

export function setSettingsOpen(value: boolean) {
	state.isSettingsOpen = value;
}

export function openSettings() {
	setSettingsOpen(true);
}

export function closeSettings() {
	setSettingsOpen(false);
}

export function toggleSettings() {
	state.isSettingsOpen = !state.isSettingsOpen;
}

export function setTextAlignment(value: TextAlignment) {
	state.textAlignment = value;
}

export function setTextOnTop(value: boolean) {
	state.isTextOnTop = value;
}

export function setLabelFontSize(size: number) {
	state.labelFontSize = size;
}

export function setTimeFontSize(size: number) {
	state.timeFontSize = size;
}

export function setEditingFormat(value: boolean) {
	state.isEditingFormat = value;
}

export function setDevMode(value: boolean) {
	state.isDev = value;
}

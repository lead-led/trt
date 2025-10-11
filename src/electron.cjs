const windowStateManager = require('electron-window-state');
const { app, BrowserWindow, ipcMain } = require('electron');
const contextMenu = require('electron-context-menu');
const serve = require('electron-serve');
const path = require('path');
const Store = require('electron-store');

const { StoreListeners } = require('./main/classes/index.cjs');
const { updater } = require('./main/updater.cjs');
const { ServerController } = require('./main/controllers/server_controller.cjs');
// @ts-ignore
const { availableIps } = require('./main/utils/setIps.cjs');

const store = new Store();
const storeListeners = new StoreListeners(store);
storeListeners.mountListeners();
let server_controller;

try {
	require('electron-reloader')(module);
} catch (e) {
	console.error(e);
}

const serveURL = serve({ directory: '.' });
const port = process.env.PORT || 5173;
const dev = !app.isPackaged;
let mainWindow;

function createWindow() {
	const windowState = windowStateManager({
		defaultWidth: 1280,
		defaultHeight: 800,
	});

	const mainWindow = new BrowserWindow({
		backgroundColor: '#202020',
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: true,
			spellcheck: false,
			devTools: true,
			preload: path.join(__dirname, 'preload.cjs'),
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
	});

	windowState.manage(mainWindow);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('close', () => {
		windowState.saveState(mainWindow);
		server_controller.nullAddWindowRefs();
		server_controller.stopAllServers();
		server_controller.killAllInstances();
	});

	return mainWindow;
}

contextMenu({
	showLookUpSelection: false,
	showSearchWithGoogle: false,
	showCopyImage: false,
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Make App 💻',
		},
	],
});

function loadVite(port) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
		console.error('Error loading URL, retrying', e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function createMainWindow() {
	mainWindow = createWindow();

	server_controller = new ServerController(mainWindow);

	mainWindow.once('close', () => {
		mainWindow = null;
	});

	mainWindow.once('show', () => {
		setTimeout(() => {}, 1000);
	});

	mainWindow.once('ready-to-show', () => {
		if (!mainWindow) return;

		updater(dev, mainWindow);

		mainWindow.removeMenu();

		ipcMain.on('init-backend-object', (event, msg) => {
			msg = JSON.parse(msg);
			server_controller.handleInitBackendObject(msg);
		});

		ipcMain.on('delete-backend-object', (event, msg) => {
			msg = JSON.parse(msg);
			server_controller.handleDeleteBackendObject(msg);
		});

		ipcMain.on('start-server', (event, msg) => {
			msg = JSON.parse(msg);

			server_controller.handleStartServer(msg);
		});

		ipcMain.on('stop-server', (event, msg) => {
			msg = JSON.parse(msg);
			server_controller.handleStopServer(msg);
		});
	});

	if (dev) loadVite(port);
	else serveURL(mainWindow);
}

app.once('ready', createMainWindow);

app.on('activate', () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on('window-all-closed', () => {
	server_controller.stopAllServers();
	server_controller.killAllInstances();
	if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
	server_controller.stopAllServers();
	server_controller.killAllInstances();
	server_controller.nullAddWindowRefs();
	storeListeners.removeListeners();
});

ipcMain.on('to-main', (event, count) => {
	return mainWindow.webContents.send('from-main', `next count is ${count + 1}`);
});

ipcMain.on('has-loaded', (event, msg) => {
	mainWindow.webContents.send('version', app.getVersion());

	mainWindow.webContents.send('ips', availableIps());

	// mainWindow.webContents.send('is-dev', dev);

	if (dev) {
		// mainWindow.webContents.openDevTools();
	}
});

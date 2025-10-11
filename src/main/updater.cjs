const { app } = require('electron');
const { autoUpdater } = require('electron-updater');

function updater(isDev, mainWindow) {
	mainWindow.webContents.send('updater-msg', 'updater function runs');

	if (isDev) {
		return;
	}

	mainWindow.webContents.send('updater-msg', 'updater function passes check');

	autoUpdater.checkForUpdates();

	autoUpdater.on('checking-for-update', () => {
		mainWindow.webContents.send('updater-msg', 'checking for update');
	});

	autoUpdater.on('update-available', (msg) => {
		mainWindow.webContents.send('updater-msg', msg);
	});

	const restart = () => {
		if (process.platform === 'darwin') {
			setImmediate(() => {
				app.removeAllListeners('window-all-closed');
				if (mainWindow != null) {
					mainWindow.webContents.send('updater-msg', 'closing main window');
					mainWindow.close();
				}
				autoUpdater.quitAndInstall(false);
			});
		} else {
			setImmediate(() => {
				autoUpdater.quitAndInstall();
			});
		}
	};

	autoUpdater.on('error', (message) => {
		mainWindow.webContents.send('updater-msg', `error: ${JSON.stringify(message)}`);
		console.error('There was a problem updating the application');
		console.error(message);
	});

	autoUpdater.on('update-downloaded', () => {
		mainWindow.webContents.send('updater-msg', 'there is a new update');
		// notify user of restart bc of new version
		// mainWindow.webContents.send('will-restart', true);
		setTimeout(() => {
			restart();
		}, 10000);
	});
}

module.exports = { updater };

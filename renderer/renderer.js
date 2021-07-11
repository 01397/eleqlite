var ipcRenderer = window['native'].ipcRenderer;
document.getElementById('button').addEventListener('click', function () {
    ipcRenderer.send('clicked', Math.floor(Math.random() * 100));
});
ipcRenderer.on('message', console.log);

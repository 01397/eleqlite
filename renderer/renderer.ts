const { ipcRenderer } = window['native']

document.getElementById('button').addEventListener('click', () => {
  ipcRenderer.send('clicked', Math.floor(Math.random() * 100))
})
ipcRenderer.on('message', console.log)

import { app, BrowserWindow, ipcMain } from 'electron'
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

let main_gui = null

app.on('ready', () => {
  let win_option = {
    frame: false,
    width: 900,
    height: 700,
    backgroundColor: '#eee',
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  }

  win_option.width = 1300

  main_gui = new BrowserWindow(win_option)
  main_gui.loadURL('file://' + __dirname + '/renderer/index.html')

  const db = new sqlite3.Database(path.join(__dirname, 'testfile.db'))
  db.serialize(function () {
    // テーブル作成のクエリを実行する
    db.run('create table users (name text, email text, age int)')
  })
})
ipcMain.on('clicked', (e, num: number) => {
  const db = new sqlite3.Database('testfile.db')
  const stmt = db.prepare("insert into users('name', 'email', 'age') values(?, ?, ?)")
  stmt.run(`John ${num}`, 'test@test.local', 20)

  console.log('[clicked]')

  db.all('SELECT name, age FROM users', (err, rows) => {
    if (err) {
      throw err
    }
    rows.forEach((row) => {
      e.sender.send('message', row.name + ' ' + row.age)
    })
  })
})

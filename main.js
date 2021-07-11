'use strict'
exports.__esModule = true
var electron_1 = require('electron')
var path = require('path')
var sqlite3 = require('sqlite3').verbose()
var main_gui = null
electron_1.app.on('ready', function () {
  var win_option = {
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  }
  main_gui = new electron_1.BrowserWindow(win_option)
  main_gui.loadURL('file://' + __dirname + '/renderer/index.html')
  var db = new sqlite3.Database(path.join(__dirname, 'testfile.db'))
  db.serialize(function () {
    // テーブル作成のクエリを実行する
    db.run('create table users (name text, email text, age int)')
  })
})
electron_1.ipcMain.on('clicked', function (e, num) {
  var db = new sqlite3.Database('testfile.db')
  var stmt = db.prepare("insert into users('name', 'email', 'age') values(?, ?, ?)")
  stmt.run('John ' + num, 'test@test.local', 20)
  console.log('[clicked]')
  db.all('SELECT name, age FROM users', function (err, rows) {
    if (err) {
      throw err
    }
    rows.forEach(function (row) {
      e.sender.send('message', row.name + ' ' + row.age)
    })
  })
})

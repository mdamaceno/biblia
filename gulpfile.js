const gulp = require('gulp')
const electron = require('electron-connect').server.create()

gulp.task('start', () => {
    electron.start()
        //Watch js files and restart Electron if they change
    gulp.watch('app/assets/**/*.js', [electron.restart])
        //watch css files, but only reload (no restart necessary)
    gulp.watch('app/css/**/*.css', [electron.restart])
        //watch html
    gulp.watch('app/index.html', [electron.restart])
})

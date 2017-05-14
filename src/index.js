'use strict'
const app = require('./app')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8080

app.listen( port, host, console.info(
    `App listening at http://${host}:${port}` ) )

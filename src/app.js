'use strict'
const morgan = require('morgan')
const restify = require('restify')
const pirateSpeak = require('pirate-speak')


const app = restify.createServer({
    name:    'Pirate Speak API',
    version: '1.0.0'
})

app.use( morgan( 'combined', { stream: msg => console.info( msg ) } ) )
app.use( restify.acceptParser( app.acceptable ) )
app.use( restify.fullResponse() )
app.use( restify.queryParser() )
app.use( restify.bodyParser() )
app.use( restify.gzipResponse() )
app.use( restify.CORS() )

app.on( 'InternalError', ( req, res, err ) => {
    console.error( err )
    res.send( err.statusCode || 500, { error: err } )
})

// CORS nonsense
app.opts( /\.*/, ( req, res, next ) => {
    //res.setHeader( 'Access-Control-Allow-Origin', `http://${host}:${port}` )
    res.setHeader( 'Access-Control-Allow-Origin', '*' )
    res.setHeader( 'Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE' )
    res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type,Accept' )
    res.send( 200 )
    next()
})

app.use( ( req, res, next ) => {
    console.info( req.method, req.url )
    next()
})

app.get( '/status', ( req, res ) => {
    res.send( 200, { ping: 'pong' } )
})

app.get( '/', ( req, res ) => {
    try {
        res.send( 200, pirateSpeak.translate( req.query.text ) )
    }
    catch ( err ) {
        res.send( 500, err )
    }
})

app.on( 'after', ( req, res, route, err ) => {
    if ( err ) console.error( err )
})


module.exports = app

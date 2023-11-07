const express = require('express')
const cors = require('cors'); // Import the cors package
let json = require('./sessions.json')
const app = express()
const port = 3000;

app.use(cors());

console.log(json)
app.get('/nes1-session1', (req, res) => {
    res.send(json.sessions[0])
})
app.get('/nes1-session2', (req, res) => {
    res.send(json.sessions[1])
})
app.get('/nes1-session3', (req, res) => {
    res.send(json.sessions[2])
})



app.get('/getSessions', (req, res) => {
    res.send(['/nes1-session1', '/nes1-session2', 'nes1-session3', 'nes1-session4'])
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
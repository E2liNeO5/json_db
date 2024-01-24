const express = require('express')

const app = express()


app.use('/user', require('./routes/user'))


app.listen(5000, () => {
  console.log('Server has been started at port 5000')
})
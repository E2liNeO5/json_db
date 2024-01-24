const express = require('express')
const path = require('path')
const json_db = require('../json_db/json_db')(path.join(__dirname, '../db.json'))

const router = express.Router()


router.get('/', async (req, res) => {
  try {
    const result = await json_db.getTableItemsWhere('user', item => item.age < 15)
    res.json({ result })
  } catch(e) {
    res.send(e)
  }
})

module.exports = router
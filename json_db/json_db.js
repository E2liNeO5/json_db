const fs = require('fs')
const path = require('path')

function json_db($db_url) {

  const db_url = $db_url

  const writeDb = (data) => {
    return new Promise(async (resolve, reject) => {
      fs.writeFileSync(db_url, JSON.stringify(data))
      resolve()
    })
  }

  const readDb = () => {
    return new Promise((resolve, reject) => {
      try {
        const text = fs.readFileSync(db_url)
        resolve(JSON.parse(text))
      } catch(e) {
        reject(e)
      }
    })
  }

  const getTableItems = (tablename) => {
    return new Promise(async (resolve, reject) => {
      const db = await readDb()
      if(!db[tablename])
        reject(`Table ${tablename} doesn't exist`)

      resolve(db[tablename].values)
    })
  }

  const getTableItemsWhere = (tablename, condition) => {
    return new Promise(async (resolve, reject) => {
      const db = await readDb()
      if(!db[tablename])
        reject(`Table ${tablename} doesn't exist`)

      const items = db[tablename].values.filter(condition)

      resolve(items)
    })
  }

  const createTable = (tablename, columns) => {
    // columns = ['column1', 'column2']
    return new Promise(async (resolve, reject) => {
      const db = await readDb()
      if(db[tablename])
        reject(`Table ${tablename} already exist`)

      db[tablename] = {
        last_id: 0,
        columns: ['id', ...columns.filter(column => column != 'id')],
        values: []
      }
    
      await writeDb(db)
      resolve()
    })
  }

  const deleteTable = (tablename) => {
    return new Promise(async (resolve, reject) => {
      const db = await readDb()
      if(!db[tablename])
        reject(`Table ${tablename} doesn't exist`)

      delete db[tablename]

      await writeDb(db)
      resolve()
    })
  }

  const getTableColumns = (tablename) => {
    // columns = ['column1', 'column2']
    return new Promise(async (resolve, reject) => {
      const db = await readDb()
      if(!db[tablename])
        reject(`Table ${tablename} doesn't exist`)

      resolve(db[tablename].columns)
    })
  }

  const addTableColumns = (tablename, columns) => {
    // columns = ['column1', 'column2']
    return new Promise(async (resolve, reject) => {
      const db = await readDb()
      if(!db[tablename])
        reject(`Table ${tablename} doesn't exist`)

      db[tablename].columns = [...db[tablename].columns, ...columns]

      await writeDb(db)
      resolve()
    })
  }

  const deleteTableColumns = (tablename, columns) => {
    // columns = ['column1', 'column2']
    return new Promise(async (resolve, reject) => {
      const db = await readDb()
      if(!db[tablename])
        reject(`Table ${tablename} doesn't exist`)

      columns.forEach(column => {
        if(column != 'id' && db[tablename].columns.includes(column))
          db[tablename].columns.splice(db[tablename].columns.indexOf(column), 1)
      })

      await writeDb(db_url, db)
      resolve()
    })
  }

  const insertInto = (tablename, values) => {
    /*
    values = [{
      column1: value1,
      column2: value2
    }]
    */
    return new Promise(async (resolve, reject) => {
      const db = await readDb()
      if(!db[tablename])
        reject(`Table ${tablename} doesn't exist`)

      values.forEach(value => {
        const columns = Object.keys(value)
        const item = {}

        columns.forEach(column => {
          if(!db[tablename].columns.includes(column))
            reject(`Column ${condition.column} doesn't exist in table ${tablename}`)

          item[column] = value[column]
        })
        item.id = ++db[tablename].last_id
        db[tablename].values.push(item)
      })

      await writeDb(db)
      resolve()
    })
  }

  const deleteIntoById = (tablename, id) => {
    return new Promise(async (resolve, reject) => {
      const db = await readDb()
      if(!db[tablename])
        reject(`Table ${tablename} doesn't exist`)

      const item = db[tablename].values.find(value => +value.id === +id)
      if(!item)
        reject(`Item with id = ${id} doesn't exist in table ${tablename}`)

      const index = db[tablename].values.indexOf(item)
      db[tablename].values.splice(index, 1)

      await writeDb(db)
      resolve()
    })
  }

  return {
    /* General */
    readDb,
    getTableItems,
    getTableItemsWhere,
    /* Table */
    createTable,
    deleteTable,
    /* Table columns */
    getTableColumns,
    addTableColumns,
    deleteTableColumns,
    /* Table values */
    insertInto,
    deleteIntoById
  }
}

module.exports = json_db
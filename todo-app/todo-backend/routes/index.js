const express = require("express")
const redis = require("../redis")
const router = express.Router()

const configs = require("../util/config")

let visits = 0

/* GET index data. */
router.get("/", async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits,
  })
})

router.get("/statistics", async (req, res) => {
  const count = parseInt((await redis.getAsync("todoCount")) || "0")

  res.send({
    added_todos: count,
  })
})

module.exports = router

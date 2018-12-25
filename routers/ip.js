const router = require('koa-router')()
let ip = require('../controller/ip/ip.js')

router.prefix('/ipmanage')

router.get('/getmyip', ip.getMyIp)
router.get('/getallip', ip.getAllIpData)
router.post('/returnip', ip.returnIp)
router.post('/applyip', ip.applyIp)

module.exports = router
const router = require('koa-router')()
let ip = require('../controller/ip/ip.js')

router.prefix('/ipmanage')

router.get('/getmyip', ip.getMyIp)
router.get('/getallip', ip.getAllIpData)
router.post('/returnip', ip.returnIp)
router.post('/applyip', ip.applyIp)
router.post('/addsegment', ip.addNetSegment)
router.get('/setsegment', ip.setSegment)
router.post('/deletesegment', ip.deleteSegment)
router.post('/getcount', ip.count)
router.get('/getsegment', ip.getSegment)
router.post('/getipbysegment', ip.getIpBySegment)

module.exports = router
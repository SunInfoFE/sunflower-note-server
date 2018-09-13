const router = require('koa-router')();
let punchcard = require('../controller/punchcard/punchcard.js');

router.prefix('/punchcard');

router.post('/signin', punchcard.signin)
router.post('/userList', punchcard.userList)
router.post('/allList', punchcard.allList)
router.post('/monthList', punchcard.monthList)
router.post('/userMonthList', punchcard.userMonthList)
router.post('/getLevelMember', punchcard.getLevelMember)
router.post('/setLevelMember', punchcard.setLevelMember)

module.exports = router;
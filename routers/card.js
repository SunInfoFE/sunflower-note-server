const router = require('koa-router')();
let punchcard = require('../controller/punchcard/punchcard.js');

router.prefix('/punchcard');

router.post('/signin', punchcard.signin)
router.post('/userList', punchcard.userList)
router.post('/leave', punchcard.leave)
router.post('/allList', punchcard.allList)
router.post('/currentMonthList', punchcard.currentMonthList)
router.post('/currentUserMonthList', punchcard.currentUserMonthList)

module.exports = router;
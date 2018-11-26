const router = require('koa-router')();
const order = require('../controller/order/order.js');

router.prefix('/order')

router.get('/init', order.init)
router.get('/getmenu', order.getMenu)
router.get('/gettodaydinner', order.getTodayDinner)
router.post('/commit', order.commitDinner)
router.get('/getdinnermount', order.getDinnerMount)
router.post('/modifydinner', order.modifyDinner)
router.post('/setdinner', order.setDinner)
router.get('/deletedinner', order.deleteDinner)
router.get('/getuserdinner', order.getUserDinner)
router.get('/getalluserdinner',order.getAllUserDinner)
router.post('/admindelete', order.adminDelete)

module.exports = router
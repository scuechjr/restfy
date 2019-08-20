var restify = require('restify');
var friendMapper = require('./FriendMapper')
var jobManager = require('./Job')

var server = restify.createServer();

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// let job = {
//     // START(1, "开始执行"),
//     // RESTART(2, "重新执行"),
//     // STOP(3, "停止执行"),
//     // RPC(4, "远程方法调用"),
//     type: 1
// };

server.put('/wx/job', function getJob(req, res, next) {
    jobManager.saveJob(req.body);
    res.send(200, 'OK');
    return next();
});

server.get('/wx/job', function getJob(req, res, next) {
    res.send(200, JSON.stringify(jobManager.getJob()));
    return next();
});

server.post('/wx/saveFriend', function saveFriend(req, res, next) {
    try {
        if (!req.body) {
            console.log('请求体没有内容');
            res.send(200, 'FAIL');
        } else {
            console.log('save friend: ' + req.body.id + ' ' + req.body.nickName)
            friendMapper.save(req.body);
            res.send(200, 'OK');
        }
    } catch (e) {
        console.log('save error', e);
    }
    return next();
});

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
'use strict'
let fs = require('fs');
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('WebChat');

const TABLE_NAME = "friend";
const TABLE_COLS = [
    { name: "id", type: "INT" },
    { name: "nickName", type: "TEXT" },
    { name: "address", type: "TEXT" },
    { name: "deleted", type: "BOOLEAN" },
    { name: "desc", type: "TEXT" },
    { name: "forbiddenVisitPengYouQuan", type: "BOOLEAN" },
    { name: "pengYouQuanDayLimitDesc", type: "TEXT" },
    { name: "pengYouQuanContent", type: "TEXT" },
];

function createTable() {
    db.serialize(function() {
        let cols = [];
        TABLE_COLS.forEach(function(col) {
            cols.push(col.name + ' ' + col.type);
        });
        db.run("CREATE TABLE IF NOT EXISTS " + TABLE_NAME + '(' + cols.join() + ')');
    });
}

function appendToFile(content) {
    fs.writeFile('./' + TABLE_NAME + '.log', content + '\n', { 'flag': 'a' }, function(err) {
        if (err) {
            console.log('写入日志文件异常' + err);
        }
    });
}

function save(friend) {
    if (!friend) {
        return;
    }

    // 写入文件
    appendToFile(JSON.stringify(friend));

    let cols = [];
    let values = [];
    let prepares = [];
    TABLE_COLS.forEach(function(col) {
        if (friend[col.name]) {
            cols.push(col.name);
            values.push(friend[col.name]);
            prepares.push('?')
        }
    });
    var stmt = db.prepare('insert into friend(' + cols.join() + ') values(' + prepares.join() + ')');
    stmt.run(values);
    stmt.finalize();
}

function queryAll() {
    let rows = [];
    db.serialize(function() {
        let cols = [];
        TABLE_COLS.forEach(function(col) {
            cols.push(col.name);
        });
        db.each('select ' + cols.join() + ' from ' + TABLE_NAME, function(err, row) {
            if (row) {
                rows.push(row);
            }
        });
    });
    return rows;
}

// db.serialize(function() {
//     // These two queries will run sequentially.（同步进行、序列化、按顺序执行）
//     console.log(client.collector1);
//     console.log('\n11111111111111:');
//     db.all(" select eqpt_pfc from eqpt_info where eqpt_id_code='" + client.collector1 + "'", function(err, rows) {
//         console.log('\n1:');
//         console.log(rows[0]);
//         PFC = rows[0].eqpt_pfc;
//         console.log(PFC);
//     });
//     db.all(" select eqpt_baudrate , eqpt_commport , eqpt_measurecode , eqpt_rate , eqpt_zsw , eqpt_xsw , eqpt_dlh , eqpt_xlh , eqpt_yblx from eqpt_info where eqpt_id_code = '" + address + "'", function(err, rows) {
//         console.log('\n2:');
//         console.log(rows[0]);
//     });
// });



// db.serialize(function() {
//     db.run("CREATE TABLE user (id INT, dt TEXT)");
//     var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
//     for (var i = 0; i < 10; i++) {
//         var d = new Date();
//         var n = d.toLocaleTimeString();
//         stmt.run(i, n);
//     }
//     stmt.finalize();
//     db.each("SELECT id, dt FROM user", function(err, row) {
//         console.log("User id : " + row.id, row.dt);
//     });
// });
function close() {
    db.close();
}

createTable();
module.exports = {
    save: save,
    queryAll: queryAll,
    close: close
};
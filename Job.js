'use strict'
let fs = require('fs');
let JOB = './job.txt'

function getJob() {
    let data = fs.readFileSync(JOB, 'utf-8');
    try {
        if (data) {
            return JSON.parse(data);
        }
    } catch (err) {
        console.log(err);
    }
    return null;
}

function saveJob(job) {
    if (job) {
        fs.writeFileSync(JOB, JSON.stringify(job));
    }
}

module.exports = {
    getJob: getJob,
    saveJob: saveJob,
};
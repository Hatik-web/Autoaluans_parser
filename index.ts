import cluster from 'cluster'
import os from 'os'
import {start} from "./app";
const pid = process.pid

if (cluster.isMaster){
    const cpusCount = os.cpus().length
    console.log(`CPUs: ${cpusCount}`)
    console.log(`Master started. Pid: ${pid}`)
    for (let i = 0; i < cpusCount -1; i++){
        cluster.fork();
    }
    cluster.fork()
}

if (cluster.isWorker){
    start(cluster.worker.id)
}
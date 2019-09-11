const http =require("http")
const fork =require("child_process").fork;
// const numCPUs =require('os').cpus().length;
// const cluster =require("cluster")
// if(cluster.isMaster){
//     console.log('Master proces id is',process.pid);
//     // fork workers
//     for(let i= 0;i<numCPUs;i++){
//         cluster.fork();
//     }
//     cluster.on('exit',function(worker,code,signal){
//         console.log('worker process died,id',worker.process.pid)
//     })
// }else{
//     // Worker可以共享同一个TCP连接
//     // 这里是一个http服务器
//     http.createServer(function(req,res){
//         res.writeHead(200);
//         res.end('hello word');
//     }).listen(8000);

// }

const server =http.createServer((req,res) => {
    if(req.url == '/compute'){
        const compute =fork('./fork_compute.js');
        compute.send('开启一个新的子进程')
            // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
        compute.on('message', sum => {
            res.end(`Sum is ${sum}`)
            compute.kill();
        });
        // 子进程监听到一些错误消息退出
        compute.on('close', (code, signal) => {
            console.log(`收到close事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`);
            compute.kill();
        })
    }else {
        res.end(`ok`)
    }

})
server.listen(3000, '127.0.0.1' ,() => {
    console.log(`server started at http://${'127.0.0.1'}:${3000}`);
})

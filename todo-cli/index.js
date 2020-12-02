const homedir = require('os').homedir()
const home = process.env.HOME || homedir

const path = require('path')
const fs = require('fs')

const dbPath = path.join(home,'.todo')

module.exports.add = (title) => {
    // 读取之前的人任务
    fs.readFile(dbPath, { flag: 'a+' }, (error, data) => {
        if (error) {
            console.error(error)
        } else {
            let list 
            try {
                list  = JSON.parse(data.toString())
            } catch (error2) {
                list = []
            }
            const task = {
                title,
                done:false
            }
            list.push(task)
            const string = JSON.stringify(list)
            fs.writeFile(dbPath, string, (error3) => {
                if(error3){console.error(error3)}
            })
            console.log(list)
        }
        
    })
}

module.exports.clear = () => {
    fs.writeFile(dbPath, '[]', (error) => {
        if(error){console.error(error)}
    })
}

module.exports.list = () => {
    fs.readFile(dbPath, { flag: 'a+' }, (error, data) => {
        if (error) {
            console.error(error)
        } else {
            console.log(data.toString())
        }
    })
}
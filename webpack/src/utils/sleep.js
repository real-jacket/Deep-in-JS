function sleep() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('success')
        }, 10)
    })
}

module.exports = {
    sleep
}
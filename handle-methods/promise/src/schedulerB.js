// 基本思路
// 1、先把要执行的promise function 存到数组内
// 2、既然是最多为2个，那我们必然是要启动的时候就要让两个promise函数执行
// 3、设置一个临时变量，表示当前执行ing几个promise
// 4、然后一个promise执行完成将临时变量-1
// 5、然后借助递归重复执行

function Scheduler() {
	this.list = []
	this.add = function (promiseCreator) {
		this.list.push(promiseCreator)
	}

	this.maxCount = 2

	var tempRunIndex = 0

	this.taskStart = function () {
		for (var i = 0; i < this.maxCount; i++) {
			request.bind(this)()
		}
	}

	function request() {
		if (!this.list || !this.list.length || tempRunIndex >= this.maxCount) {
			return
		}

		tempRunIndex++
		this.list
			.shift()()
			.then(() => {
				tempRunIndex--
				request.bind(this)()
			})
	}
}

function timeout(time) {
	return new Promise((resolve) => {
		setTimeout(resolve, time)
	})
}

var scheduler = new Scheduler()

function addTask(time, order) {
    scheduler.add(
        () => timeout(time)
            .then(() => console.log(order))
    )
}

addTask(1000, 1)
addTask(500, 2)
addTask(300, 3)
addTask(400, 4)

scheduler.taskStart()

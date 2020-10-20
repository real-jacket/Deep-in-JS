// 发布订阅模式
class PubSub {
	constructor() {
		this.subscribers = []
	}

	subscribe(topic, callback) {
		let callbacks = this.subscribers[topic]
		if (!callbacks) {
			this.subscribers[topic] = [callback]
		} else {
			callbacks.push(callback)
		}
	}

	publish(topic, ...args) {
		let callbacks = this.subscribers[topic] || []
		callbacks.forEach((callback) => callback(...args))
	}
}

// 创建事件调度中心，为订阅者和发布者提供调度服务
let pubSub = new PubSub()
// A订阅了SMS事件（A只关注SMS本身，而不关心谁发布这个事件）
pubSub.subscribe('SMS', console.log)
// B订阅了SMS事件
pubSub.subscribe('SMS', console.log)
// C发布了SMS事件（C只关注SMS本身，不关心谁订阅了这个事件）
pubSub.publish('SMS', 'I published `SMS` event')




// 观察者模式
// 目标
class Subject{
	constructor() {
		this.observers = []
	}

	add(observer) {
		this.observers.push(observer)
	}

	notify(...args) {
		this.observers.forEach(observer=> observer.update(...args))
	}
}

// 观察者
class Observer {
	update(...args) {
		console.log(...args)
	}
}

// 创建观察者ob1
let ob1 = new Observer()
// 创建观察者ob2
let ob2 = new Observer()
// 创建目标sub
let sub1 = new Subject()
let sub2 = new Subject()
// 目标sub添加观察者ob1 （目标和观察者建立了依赖关系）
sub1.add(ob1)
sub1.add(ob2)
// 目标sub添加观察者ob2
sub2.add(ob2)
// 目标sub触发SMS事件（目标主动通知观察者）
sub1.notify('I fired `SMS` event 1')
// sub2.notify('I fired `SMS` event 2')

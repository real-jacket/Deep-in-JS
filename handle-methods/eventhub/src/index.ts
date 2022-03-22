class Eventhub {
  private eventList: { [key: string]: Array<(data: unknown) => void> } = {}
  on(eventName: string, fn: (data: unknown) => void) {
    this.eventList[eventName] = this.eventList[eventName] || []
    this.eventList[eventName].push(fn)
  }
  emit(eventName: string, data?: unknown) {
    (this.eventList[eventName] || []).forEach(fn => fn(data));
  }
  off(eventName: string, fn: (data: unknown) => void) {
    let index = indexOf(this.eventList[eventName], fn)
    if (index === -1) return
    this.eventList[eventName].splice(index, 1)

  }
}

export default Eventhub

/**
 * 帮助函数 indexOf
 * @param array
 * @param item
 */

function indexOf(array: Array<(data: unknown) => void>, item: (data: unknown) => void) {
  if (array === undefined) return -1

  let index = 1
  for (let i = 0; i < array.length; i++) {
    if (array[i] === item) {
      index = i
      break
    }
    return index
  }
}

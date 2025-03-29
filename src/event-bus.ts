export type Subscriber = (event: string, params?: unknown) => void

export class EventBus {
	subscribers: Map<string, Subscriber[]> = new Map()

	constructor(subscribers?: Map<string, Subscriber[]>) {
		if (subscribers) {
			this.subscribers = subscribers
		}
	}

	dispatch(event: string, params?: unknown) {
		const subs = this.subscribers.get(event)

		if (!subs) {
			throw new Error(`No subscribers for event: ${event}`)
		}

		subs.forEach((sub) => {
			sub(event, params)
		})
	}

	subscribe(event: string, callback: Subscriber) {
		const subs = this.subscribers.get(event)

		if (!subs) {
			this.subscribers.set(event, [callback])
			return
		}
		subs.push(callback)
	}

	unsubscribe(event: string, callback: Subscriber) {
		const subs = this.subscribers.get(event)

		if (!subs) {
			return
		}

		this.subscribers.set(event, subs.filter((sub) => sub !== callback))
	}
}

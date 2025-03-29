export type Subscriber = (event: string, params?: unknown) => void

export type Action = 'INIT' | 'SUB' | 'UNSUB' | 'DISPATCH'

export type EventBusHistoryItem = {
	ts: number
	action: Action
	payload: unknown
}

export type EventBusOpts = {
	name?: string
	printLogs?: boolean
	saveLogs?: boolean
	subscribers?: Map<string, Subscriber[]>
}

export class EventBus {
	name: string
	printLogs: boolean = false
	saveLogs: boolean = false
	history: EventBusHistoryItem[] = []
	subscribers: Map<string, Subscriber[]> = new Map()

	constructor(opts?: EventBusOpts) {
		const defaultName = 'EVENT_BUS'
		if (!opts) {
			this.name = defaultName
			return
		}

		const {
			name = defaultName,
			subscribers,
			printLogs = false,
			saveLogs = false,
		} = opts

		this.name = name
		this.printLogs = printLogs
		this.saveLogs = saveLogs

		this.log('INIT', { subscribers })

		if (subscribers) {
			this.subscribers = subscribers
		}
	}

	dispatch(event: string, params?: unknown) {
		const subs = this.subscribers.get(event)

		if (!subs) {
			throw new Error(`No subscribers for event: ${event}`)
		}

		subs.forEach((callback) => {
			callback(event, params)
			this.log('DISPATCH', { event, params, callback })
		})
	}

	subscribe(event: string, callback: Subscriber) {
		this.log('SUB', { event, callback })

		const subs = this.subscribers.get(event)

		if (!subs) {
			this.subscribers.set(event, [callback])
			return
		}
		subs.push(callback)
	}

	unsubscribe(event: string, callback: Subscriber) {
		this.log('UNSUB', { event, callback })

		const subs = this.subscribers.get(event)

		if (!subs) {
			return
		}

		this.subscribers.set(event, subs.filter((sub) => sub !== callback))
	}

	log(action: Action, payload: unknown) {
		const historyItem: EventBusHistoryItem = {
			ts: Date.now(),
			action,
			payload,
		}

		if (this.printLogs) {
			// eslint-disable-next-line no-console
			console.log(this.name, historyItem)
		}

		if (this.saveLogs) {
			this.history.push(historyItem)
		}
	}
}

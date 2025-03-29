import { describe, test, expect, vi } from 'vitest'
import { EventBus, Subscriber } from '../src'

describe('', () => {
	test('Dispatching with params', () => {
		const bus = new EventBus()

		const callback = vi.fn((event: string, params?: unknown) => {})

		const eventName = 'TEST-EVENT'
		const params = { someParams: '123' }

		bus.subscribe(eventName, callback)

		bus.dispatch(eventName, params)

		expect(callback).toHaveBeenCalledWith(eventName, params)
	})

	test('Dispatching without params', () => {
		const bus = new EventBus()

		const callback = vi.fn((event: string, params?: unknown) => {})

		const eventName = 'TEST-EVENT'

		bus.subscribe(eventName, callback)

		bus.dispatch(eventName)

		expect(callback).toHaveBeenCalledWith(eventName, undefined)
	})

	test('Dispatching unknown event', () => {
		const bus = new EventBus()

		const eventName = 'TEST-EVENT'
		const params = { someParams: '123' }

		expect(() => bus.dispatch(eventName, params)).toThrow()
	})

	test('Dispatching to multiple subscribers with params', () => {
		const bus = new EventBus()

		const callback1 = vi.fn((event: string, params?: unknown) => {})
		const callback2 = vi.fn((event: string, params?: unknown) => {})

		const eventName = 'TEST-EVENT'
		const params = { someParams: '123' }

		bus.subscribe(eventName, callback1)
		bus.subscribe(eventName, callback2)

		bus.dispatch(eventName, params)

		expect(callback1).toHaveBeenCalledWith(eventName, params)
		expect(callback2).toHaveBeenCalledWith(eventName, params)
	})

	test('unsubscribe', () => {
		const callback1 = (event: string, params?: unknown) => {}
		const callback2 = (event: string, params?: unknown) => {}
		const callback3 = (event: string, params?: unknown) => {}

		const bus = new EventBus(
			new Map<string, Subscriber[]>([
				['TEST-EVENT', [callback1, callback2]],
				['TEST-EVENT2', [callback3]],
			])
		)

		bus.unsubscribe('TEST-EVENT', callback2)

		expect(bus.subscribers.get('TEST-EVENT')).toMatchObject([callback1])
	})
})

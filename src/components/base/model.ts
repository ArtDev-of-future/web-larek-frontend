import { IEvents } from './events';
export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}
	changes(event: string, loading?: object) {
		this.events.emit(event, loading ?? {});
	}
}

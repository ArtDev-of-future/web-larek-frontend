import { FormErr, IAppState, ICard, IItemInit } from '../../types';
import { IEvents } from '../base/events';
export type CatalogEvent = {
	catalog: ICard[];
};
abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}
	changes(event: string, loading?: object) {
		this.events.emit(event, loading ?? {});
	}
}
export class AppState extends Model<IAppState> {
	loading: boolean;
	catalog: ICard[];
	basket: ICard[] = [];
	order: IItemInit = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErr = {};
	buttonLogic(item: ICard): boolean {
		return this.basket.indexOf(item) !== -1;
	}
	add(card: ICard) {
		if (card.price !== null && this.basket.indexOf(card) === -1) {
			this.basket.push(card);
			this.changes('basket:changed', this.basket);
		}
	}
	remove(card: ICard) {
		this.basket = this.basket.filter((item) => item !== card);
		this.changes('basket:changed', this.basket);
	}
	clear() {
		this.basket = [];
		this.changes('basket:changed', this.basket);
	}

	validate() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Payment type is required';
		}
		if (!this.order.address) {
			errors.address = 'Address is required';
		}
		if (!this.order.email) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email)) {
			errors.email = 'Email is not valid';
		}
		if (!this.order.phone) {
			errors.phone = 'Phone is required';
		} else if (
			!/^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}$/.test(this.order.phone)
		) {
			errors.phone = 'Phone is not valid';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
	catalogInit(data: ICard[]) {
		this.catalog = data;
		this.changes('items:changed', { catalog: this.catalog });
	}
	previewInit(data: ICard) {
		this.preview = data.id;
		this.changes('preview:changed', data);
	}
	orderInit(field: keyof IItemInit, value: string | number) {
		if (field === 'total') {
			this.order[field] = value as number;
		} else if (field === 'items') {
			this.order[field].push(value as string);
		} else {
			this.order[field] = value as string;
		}
		if (this.validate()) {
			this.events.emit('order:ready', this.order);
		}
	}
}

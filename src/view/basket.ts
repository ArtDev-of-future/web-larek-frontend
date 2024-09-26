import { EventEmitter } from '../components/base/events';
import { IBasket, ICard } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component, formatNumber } from './view';
export class ViewBasket extends Component<IBasket> {
	protected list: HTMLElement;
	protected _total: HTMLElement;
	protected button: HTMLElement;
	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');
		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		this.items = [];
	}
	set items(values: HTMLElement[]) {
		if (values.length) {
			this.list.replaceChildren(...values);
		} else {
			this.list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Basket is empty',
				})
			);
		}
	}
	set selected(items: ICard[]) {
		if (items.length) {
			this.disable(this.button, false);
		} else {
			this.disable(this.button, true);
		}
	}
	set total(value: number) {
		this.setText(this._total, `${formatNumber(value)} синапсов`);
	}
}

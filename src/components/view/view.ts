import { IView } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';
export function formatNumber(x: number, sep = ' ') {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

export class View extends Component<IView> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected wrapper: HTMLElement;
	protected basket: HTMLElement;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._counter = this.container.querySelector(
			'.header__basket-counter'
		) as HTMLElement;
		this._catalog = this.container.querySelector('.gallery') as HTMLElement;
		this.wrapper = this.container.querySelector(
			'.page__wrapper'
		) as HTMLElement;
		this.basket = this.container.querySelector(
			'.header__basket'
		) as HTMLElement;
		this.basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}
	set catalog(value: HTMLElement[]) {
		this._catalog.replaceChildren(...value);
	}
}

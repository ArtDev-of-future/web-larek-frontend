import { IView } from '../../types';
import { IEvents } from '../base/events';
export function formatNumber(x: number, sep = ' ') {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}
export abstract class Component<T> {
	constructor(protected container: HTMLElement) {}
	tgClass(element: HTMLElement, className: string, isAdd?: boolean) {
		element.classList.toggle(className, isAdd);
	}
	protected setText(element: HTMLElement, text: string) {
		if (element) {
			element.textContent = text;
		}
	}
	disable(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}
	protected hide(element: HTMLElement) {
		element.style.display = 'none';
	}
	protected show(element: HTMLElement) {
		element.style.removeProperty('display');
	}
	protected IMG(element: HTMLElement, src: string, alt?: string) {
		if (element) {
			element.setAttribute('src', src);
			if (alt) {
				element.setAttribute('alt', alt);
			}
		}
	}
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});

		return this.container;
	}
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

import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Component } from './view';
export class Modal extends Component<IModal> {
	protected _content: HTMLElement;
	protected closeButton: HTMLButtonElement;
	protected escapeKeyListener: (event: KeyboardEvent) => void;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('click', () => this.close());
		this._content.addEventListener('click', (event) => {
			event.stopPropagation();
		});
	}
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}
	changeVisibility(force?: boolean) {
		this.tgClass(this.container, 'modal_active', force);
	}

	open() {
		document.body.style.overflow = 'hidden';
		this.changeVisibility(true);
		this.escapeKeyListener = (event) => {
			if (event.code === 'Escape') {
				this.close();
			}
		};
		document.addEventListener('keydown', this.escapeKeyListener);
	}

	close() {
		document.body.style.overflow = 'visible';
		this.changeVisibility(false);
		this.content = null;
		document.removeEventListener('keydown', this.escapeKeyListener);
	}
	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}

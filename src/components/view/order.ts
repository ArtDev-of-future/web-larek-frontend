import { IItemInit } from '../../types';
import { ensureAllElements } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from '../model/form';
export class Order extends Form<IItemInit> {
	protected paymentButton: HTMLButtonElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.paymentButton = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this.paymentButton.forEach((button) => {
			button.addEventListener('click', () => this.selected(button.name));
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
	selected(name: string) {
		this.paymentButton.forEach((button) =>
			this.tgClass(button, 'button_alt-active', button.name === name)
		);

		this.events.emit('order:change', { name });
	}
}

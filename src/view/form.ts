import { IEvents } from '../components/base/events';
import { IFormState } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './view';
export class Form<T> extends Component<IFormState> {
	protected submit: HTMLButtonElement;
	protected _errors: HTMLElement;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this.submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	set valid(value: boolean) {
		this.submit.disabled = !value;
	}
	render(data: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = data;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

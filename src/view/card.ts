import { ICard, ICardAction } from '../types';
import { Component } from './view';
export class Card extends Component<ICard> {
	protected _button: HTMLButtonElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _basketId: HTMLElement;
	constructor(container: HTMLElement, actions?: ICardAction) {
		super(container);
		this._button = container.querySelector(`.card__button`);
		this._image = container.querySelector('.card__image');
		this._title = container.querySelector('.card__title');
		this._description = container.querySelector(`.card__text`);
		this._price = container.querySelector('.card__price');
		this._category = container.querySelector('.card__category');
		this._basketId = container.querySelector('.basket__item-index');

		if (actions.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}
	get id(): string {
		return this.container.dataset.id || '';
	}
	set basketId(value: string) {
		this._basketId.textContent = value;
	}
	get basketId(): string {
		return this._basketId.textContent || '';
	}
	private color(value: string): string {
		switch (value) {
			case 'софт-скил':
				return 'card__category_soft';
			case 'хард-скил':
				return 'card__category_hard';
			case 'кнопка':
				return 'card__category_button';
			case 'дополнительное':
				return 'card__category_additional';
			default:
				return 'card__category_other';
		}
	}
	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.remove('card__category_other');
		this._category.classList.add(this.color(value));
	}
	get category(): string {
		return this._category.textContent || '';
	}
	set title(value: string) {
		this.setText(this._title, value);
	}
	get title(): string {
		return this._title.textContent || '';
	}
	set image(value: string) {
		this.IMG(this._image, value, this.title);
	}
	set description(value: string) {
		this.setText(this._description, value);
	}
	set button(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}
	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value.toString()} синапсов`);
		}
	}
	get price(): number {
		return Number(this._price.textContent || '');
	}
}

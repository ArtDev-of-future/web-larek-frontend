export interface IItemInit extends ICustomerSet {
	total: number;
	items: string[];
}
export interface IItemCard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
export interface IBasket {
	items: HTMLElement[];
	total: number;
	selected: string[];
}
interface ICustomerSet {
	payment: string;
	address: string;
	email: string;
	phone: string;
}
export interface IView {
	catalog: HTMLElement;
	counter: number;
	block: boolean;
}
export interface ICard extends IItemCard {
	basketId?: string;
	button: string;
}
export interface IAppState {
	loading: boolean;
	catalog: IItemCard[];
	preview: string | null;
	basket: IItemCard[];
	order: IItemInit | null;
}
export interface IOrder {
	total: number;
	id: string;
}
export type FormErr = Partial<Record<keyof IItemInit, string>>;
export interface ICard extends IItemCard {
	basketId?: string;
	button: string;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}
export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}
export interface IModal {
	content: HTMLElement;
}
export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}
export interface IGetDataApi {
	getData: () => Promise<IItemCard[]>;
	sendOrder: (order: IItemInit) => Promise<IOrder>;
}

interface IItemInit {
	total: number;
	items: IItemCard[];
}

interface IItemCard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

interface IBasket {
	itemCards: IItemCard[];
	addItemCard(item: IItemCard): void;
	removeItemCard(id: string): void;
}

interface ICustomerSet {
	paymentType: string;
	address: string;
	email: string;
	phone: string;
	setCustomerInfo(customer: ICustomerSet): void;
	checkValidation(data: Record<keyof ICustomerSet, string>): boolean;
}

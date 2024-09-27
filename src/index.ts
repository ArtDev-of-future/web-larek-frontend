import { getData } from '../src/components/base/api';
import { ICard, IItemInit } from '../src/types/index';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogEvent } from './components/model/AppState';
import { ViewBasket } from './components/view/basket';
import { Card } from './components/view/card';
import { Modal } from './components/view/modal';
import { Order } from './components/view/order';
import { Success } from './components/view/success';
import { View } from './components/view/view';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
const events = new EventEmitter();

const getDataApi = new getData(API_URL, CDN_URL);
const app = new AppState({}, events);
const view = new View(document.body, events);
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const cardCatalogTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new ViewBasket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);

getDataApi
	.getData()
	.then(app.catalogInit.bind(app))
	.catch((err) => {
		console.error(err);
	});
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

events.on<CatalogEvent>('items:changed', () => {
	view.catalog = app.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

events.on('card:select', (item: ICard) => app.previewInit(item));

events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('item:check', item);
			card.button = app.buttonLogic(item)
				? 'Удалить из корзины'
				: 'Добавить в корзину';
		},
	});
	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			button: app.buttonLogic(item)
				? 'Удалить из корзины'
				: 'Добавить в корзину',
			price: item.price,
		}),
	});
});

events.on('item:check', (item: ICard) => {
	app.buttonLogic(item)
		? events.emit('item:remove', item)
		: events.emit('item:add', item);
});

events.on('item:add', (item: ICard) => {
	app.add(item);
});

events.on('item:remove', (item: ICard) => {
	app.remove(item);
});

events.on('basket:changed', (items: ICard[]) => {
	basket.items = items.map((item, basketId) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('item:remove', item);
			},
		});
		return card.render({
			basketId: (basketId + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});
	const total = items.reduce((acc, item) => acc + item.price, 0);
	basket.total = total;
	app.order.total = total;
	view.counter = app.basket.length;
	basket.selected = app.basket;
});

events.on('basket:open', () => {
	basket.selected = app.basket;
	modal.render({
		content: basket.render({}),
	});
});

events.on('order:open', () => {
	app.order.items = app.basket.map((item) => item.id);
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:change', ({ name }: { name: string }) => {
	app.order.payment = name;
	app.validate();
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('formErrors:change', (errors: Partial<IItemInit>) => {
	const { payment, address, email, phone } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((err) => !!err)
		.join('; ');

	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((err) => !!err)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IItemInit; value: string }) => {
		app.orderInit(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IItemInit; value: string }) => {
		app.orderInit(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
	const formattedOrder = {
		total: app.order.total,
		items: app.order.items,
		payment: app.order.payment,
		address: app.order.address,
		email: app.order.email,
		phone: app.order.phone,
	};
	getDataApi
		.sendOrder(formattedOrder)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.total = `Стоимость заказа: ${app.order.total} синапсов`;
			app.clear();
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

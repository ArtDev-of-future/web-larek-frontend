import { IGetDataApi, IItemCard, IItemInit, IOrder } from '../../types/index';
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}
export class getData extends Api implements IGetDataApi {
	readonly imageLink: string;

	constructor(baseUrl: string, imageLink: string, options?: RequestInit) {
		super(baseUrl, options);
		this.imageLink = imageLink;
	}

	getData(): Promise<IItemCard[]> {
		return this.get('/product').then((data: ApiListResponse<IItemCard>) =>
			data.items.map((item) => ({
				...item,
				image: this.imageLink + item.image,
			}))
		);
	}
	sendOrder(order: IItemInit): Promise<IOrder> {
		return this.post('/order', order).then((data: IOrder) => data);
	}
}

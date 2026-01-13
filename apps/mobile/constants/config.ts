export const API_CONFIG = {
	baseURL: __DEV__ ? 'http://10.0.2.2:5000' : 'https://api.betalift.com',
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
}

export interface User {
	id?: string;
	username?: string;
	password?: string;
	email?: string;
	authorities?: string[];
	isEnable?: boolean;
}

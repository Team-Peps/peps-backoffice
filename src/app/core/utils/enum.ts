export function enumKeysObject<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
	return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

export type ClassValue = ClassArray | ClassDictionary | string | number | bigint | null | boolean | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];


export function clsx(...inputs: ClassValue[]): string {
  return inputs
	.flat()
	.filter((item) => typeof item === 'string' || typeof item === 'number')
	.join(' ');
}

export default clsx;
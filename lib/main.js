'use babel';
/* @flow */

export function getHyperclickProvider(): HyperclickProvider {
	return require('./hyperclick-provider').provider;
}

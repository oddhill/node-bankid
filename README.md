# BankID API Client

This package will help you make requests to the BankID SOAP API.

## Requirements

- A pfx certificate issued by a certified Bank.
- The soap module needs to be installed as a dependency.

## Getting started

Run the following command in your terminal to install the module to your project.

```
npm install bankid node-soap --save
```

## Example

Below is an example showing how to use the library when making a request to the Authenticate method on the BankID SOAP API.

```javascript
const bankid = require('bankid);

const options = {
	pfx: './path-to-your-pfx-certificate.pfx',
	passphrase: 'certpassphrasse',
};

bankid(options, (err, service) => {
	if (err) console.log(err);
	
	const args = {
		personalNumber: '199801011234',
	};
	
	service.authenticate(args, (err, response) => {
		console.log(response);
	});
});
```
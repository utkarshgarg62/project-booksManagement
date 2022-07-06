# Simple ISBN validator

[![NPM Version][npm-version]][npm-url]
[![Build Status][travis-image]][travis-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][npm-url]

Validator check ISBN in format ISBN-10 and ISBN-13.

## Instalation ##
```javascript
npm install isbn-validate
```


## Simple using ##
For use ISBN validator you have to import 'isbn-validate' and call static method ISBN.Validate. This method accept one argument - isbn number to validate. ISBN should be string type, but number type also is right (number will converted to string with global method Number.prototype.toString).

*Method ISBN.Validate always returns boolean value TRUE or FALSE.*

**Example:**
```javascript
const ISBN = require( 'isbn-validate' );

ISBN.Validate( '048665088X' );    //true - ISBN-13
ISBN.Validate( '9788371815102' ); //true - ISBN-13

ISBN.Validate( '048665088A' );    //false - invalid letter 'A'
ISBN.Validate( '03064061521' );   //false - to many digits
```
**Optional prefixes in ISBN nubers**

ISBN number is checked with regular expression, which allowed optional prefixes. Example prefixes which will be removed after validate control digit in ISBN:
```
ISBN number
ISBN: number
ISBN-10 number
ISBN-13 number
ISBN-10: number
ISBN-13: number

and with small letters:

isbn number
isbn: number
isbn-10 number
isbn-13 number
isbn-10: number
isbn-13: number
```
After 'ISBN' have to been one space, char ':' or symbol of ISBN type (10 or 13). Always before whole number have to been one space! For example the following ISBN numbers will validated as incorrect:
```
ISBNnumber
ISBN:number
ISBN-10number
ISBN-13number
ISBN-10:number
ISBN-13:number
```
**Char 'X' or 'x' as control digit**

In INSB-13 is allowed char 'X' or 'x' as last digit (control digit), when checksum for number is equal 10. In ISBN-13 number char 'X' and 'x' is not allowed.

<!-- vars -->
[npm-version]:https://img.shields.io/npm/v/isbn-validate.svg?style=flat-square
[npm-url]: https://npmjs.org/package/isbn-validate
[license-image]:https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: #license
[travis-image]:https://img.shields.io/travis/drogimex/isbn-validate.svg?style=flat-square
[travis-url]:https://travis-ci.org/drogimex/isbn-validate
[downloads-image]: http://img.shields.io/npm/dm/isbn-validate.svg?style=flat-square

# Sidekicker

A lib for Typescript/Javascript to help you in any project

**A compiled of most of the functions I use/forget**

# How to use

```bash
npm install --save sidekicker
```

For now, sidekicker exports 6 modules, one is a shortcut do LINQ

## Validations

### isCPF

`isCPF("111.111.111-11") // false`
isCPF have rules to more specif validations. You can pass an object with:

-   mask: Return true when string has CPF mask
-   digit: Verify the ninth digit
-   states: Validate by accord the ninth digit, matching with state rule

```javascript
isCPF("111.111.111-11", {
    mask: false,
    states: ["SP", "RJ", "RS", "PB"],
}); // false
```

### isEmail

`isEmail("foo@bar.io") // true`
Validate email string, by accord [RFC 5322](https://tools.ietf.org/html/rfc5322). Like CPF, have
a three rules to apply.

-   domain: check the domain of email, like "@gmail" or "@protonmail" `TODO: check array of domains`
-   notIncludeChars: negate if exist chars in email
-   namePattern: a regex to check pattern of name in email: name@domain.com

```javascript
isEmail("foo@bar.com", {
    domain: "bar.com",
    notIncludeChars: "_*#$",
    namePattern: "[a-z]{2}",
});
```

### isUrl

`isUrl("https://github.com/vandalvnl/sidekicker") // true`

```javascript
isUrl("https://github.com/vandalvnl/sidekicker", {
    domain: "github.com"
    protocols: ["http", "https"]
    routesOrder: ["vandalvnl", "sidekicker"]
    maxRoutes: 3
}) // true
```

### Validator

Validate one value with multiple rules
First parameter: your object
Second parameter: your validate rules, where key is the key to access in object and value is a
array with Tuple (two positions array). In Tuple, the first value is a message, and the second
value is a function to validate your value, this function receive two arguments, first is the
current value in object and the second value is the object

```javascript
const person = {
    email: "ci@cla.no",
    name: "FooBar Lano",
};
const validating: ValidatorRules = {
    email: [["Equals", (x: string, y: any) => y.name === " FooBar Lano"]],
    name: [["Different", (x: string) => x !== "FooBar Lano"]],
};
Validator(person, validating);
/* {
    email: [ { message: 'Equals', valid: false } ],
    name: [ { message: 'Different', valid: false } ]
}*/
```

## Strings

This module has Format, Utils, Url, Cut and TR (two last is emulate function of unix commands)

### Utils

-   bothPadding: pad a string with another string. Both sides
-   brazilize: capitalize all the sentence, excluding brazilian articles
-   camelize: any to camelCase
-   capitalize: first char to UpperCase
-   convert: convert to human readable format
-   leftPadding: left pad in string
-   mask: apply a mask to string with the argument, default is \*
-   nextChar: return next char of string (ASCII table)
-   onlyChars: exclude all numbers and simbols
-   onlyNumbers: exclude all except numbers
-   padding: right pad in string
-   previousChar: return previous char of string (ASCII table)
-   readableString:
-   replaceAll: replace all occurrences in string
-   reverse: return the reverse string
-   rightPadding: same of padding
-   slugify: return the slugify-string-format
-   sneakize: return the sneakize_string_format
-   titlelize: capitalize all words in sentence
-   toFloat: safe float convert with control of decimals, default is 2
-   toInt: safe integer convert
-   trueTrim: trim all spaces/tabs in string
-   truncate: truncate like read more...

### Format

-   formatCardNumber: format string to card number (XXXX XXXX XXXX XXXX)
-   formatCep: format as cep (XXXXX-XXX)
-   formatCpf: format as CPF (XXX.XXX.XXX-XX)
-   formatDecimals: format number with decimals control, default is 2
-   formatPhone: format phone (9XXXX-XXXX or XXXX-XXXX)
-   formatPhoneDDD: format phone with DDD `(XX) 9XXXX-XXXX`

### URL

-   getUrlParameters: get parameters of URL `?id=1&foo=bar`
-   splitUrlValues: get parameter values
-   urlOnlyParameters: get url parameter keys
-   urlParameters: get url parameters as key:values
-   urlProtocol: get protocol of URL

## Collection

### Linq

Similar C# Linq dialect. See more in `examples/Linq.ts`

-   average: Get average of value. Argument: string as key of objects
-   count: length of linq list
-   countBy: length of list with custom filter. Argument: function to filter
-   get: return the linq list with all operations
-   groupBy: group elements by rules
-   head: return the first elements
-   ifEmpty: if empty, return a default value. Must call at last
-   join: concat elements
-   map: iterate with map to convert objects
-   orderBy: order linq list by key. Argument: string as key of objects
-   paginate: split list and return a portion as page. Parameter: range and page
-   reverse: return the linq list reversed
-   select: same of get
-   sum: sum all values. Argument: string as key of objects
-   tail: returrn the last elements
-   uniq: return only uniq elements, exclude duplicates
-   uniqBy: uniq by accord rules
-   where: require a key to control, an operator and value to compare
    Where operators

```javascript
| "!=": strings and numbers
| "!==": strings and numbers
| "<": strings and numbers
| "<=": strings and numbers
| "==": strings and numbers
| "===": strings and numbers
| ">": strings and numbers
| ">=": strings and numbers
| "isAfter": time and Moment
| "isBefore": strings and numbers
| "like": any, works with regex string .*
| "isSameOrAfter": time and Moment
| "isSameOrBefore": time and Moment
```

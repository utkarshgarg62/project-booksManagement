/* 
 * @author: Tomasz Sochacki
 * Regular Expression for validate ISBN-10 and ISB-13
 */

/*
 * Regexp for remove prefix in ISBN number.
 * Example prefixes which will be removed:
 * ISBN number
 * ISBN: number
 * ISBN-10 number
 * ISBN-13 number
 * ISBN-10: number
 * ISBN-13: number
 * 
 * Regexp description:
 * /^ISBN       on start 'ISBN' or 'isbn'
 * (?:-1[03])?  optional prefix -10 or -13
 * :?           optional colon ":"
 * \x20+        minimum one space
 * /i           case insensitive
 */
const PREFIX = /^ISBN(?:-1[03])?:?\x20+/i;

/*
 * Regexp for validate ISBN (only nubers or char "X").
 * Example for ISBN-10: "048665088X", "0306406152".
 * Example for ISBN-13: "9788371815102".
 * 
 * Regexp description:
 * /^          start of string
 * (?:
 *    \d{9}    9 digits
 *    [\dXx]   and of end one digit or char "X"/"x"
 *    |\d{13}  or 13 digits (ISBN-13)
 * )$/         and of string
 */
const ISBN = /^(?:\d{9}[\dXx]|\d{13})$/;

module.exports = {
    PREFIX,
    ISBN
};
/* 
 * @author: Tomasz Sochacki
 * ISBN-13 and ISBN-10 validator.
 */

const regexp = require( './src/regexp' );
const checksum = require( './src/checksum' );

class ISBN {
    static Validate( isbn ) {
        //Method always retruns boolean value!
        
        //Remove optional prefix:
        isbn = isbn.replace( regexp.PREFIX, '' );
        
        if( !regexp.ISBN.test( isbn ) ) {
            return false;
        }
        
        return checksum( isbn ); //true or false
    }
}

module.exports = ISBN;
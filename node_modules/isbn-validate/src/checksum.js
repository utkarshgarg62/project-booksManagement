/* 
 * @author: Tomasz Sochacki
 * Checksum for validate ISBN-10 and ISBN-13.
 */

const checksum = ( isbn ) => {
    //isbn have to be number or string (composed only of digits or char "X"):
    isbn = isbn.toString();

    //Remove last digit (control digit):
    let number = isbn.slice( 0,-1 );
	
    //Convert number to array (with only digits):
    number = number.split( '' ).map( Number );
    
    //Save last digit (control digit):
    const last = isbn.slice( -1 );
    const lastDigit = ( last !== 'X' ) ? parseInt( last, 10 ) : 'X';

    //Algorithm for checksum calculation (digit * position):
    number = number.map( ( digit, index ) => {
        return digit * ( index + 1 );
    } );
    
    //Calculate checksum from array:
    const sum = number.reduce( ( a, b ) => a + b, 0 );

    //Validate control digit:
    const controlDigit = sum % 11;
    return lastDigit === ( controlDigit !== 10 ? controlDigit : 'X' ); 
};

module.exports = checksum;

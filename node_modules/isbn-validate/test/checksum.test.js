const checksum = require( '../src/checksum' );

describe( 'Test of checksum algorithm.', () => {
    //All numbers have to been tested with regexp PREFIX and ISBN!
    it( 'Tests of correct control digit in ISBN numbers.', () => {
        const correctISBN = [
            '048665088X',    //ISBN-10
            '0306406152',    //ISBN-10
            '9788371815102', //ISBN-13
        ];
        correctISBN.forEach( isbn => {
            expect( checksum( isbn ) ).toBeTruthy();
        } );
    } );
    
    it( 'Tests of incorrect control digit in ISBN numbers.', () => {
        const incorrectISBN = [
            '0486650881',    //control digit should be equal "X"
            '0486650880',    //control digit should be equal "X"
            '0306406155',    //control digit should be equal "2"
            '9788371815101', //control digit should be equal "2"
        ];
        incorrectISBN.forEach( isbn => {
            expect( checksum( isbn ) ).toBeFalsy();
        } );
    } );
    
} );
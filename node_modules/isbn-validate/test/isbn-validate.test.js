const ISBN = require( '../isbn-validate' );

describe( 'Test of main static method ISBN.Validate.', () => {
    it( 'Tests of correct ISBN numbers.', () => {
        const correctISBN = [
            //Without prefix:
            '048665088X',
            '0306406152',
            '9788371815102',
            //With prefix:
            'ISBN 048665088X',
            'ISBN: 048665088X',
            'ISBN-10 048665088X',
            'ISBN-13 048665088X',
            'ISBN-10: 048665088X',
            'ISBN-13: 048665088X',
            'isbn 048665088X',
            'isbn: 048665088X',
            'isbn-10 048665088X',
            'isbn-13 048665088X',
            'isbn-10: 048665088X',
            'isbn-13: 048665088X'
        ];
        correctISBN.forEach( isbn => {
            expect( ISBN.Validate( isbn ) ).toBeTruthy();
        } );
    } );
    it( 'Tests of incorrect ISBN numbers.', () => {
        const correctISBN = [
            //Without prefix:
            '048665088A',    //invalid letter 'A'
            '03064061521',   //too many digits (11)
            '030640615',     //not enought digits (9)
            //With prefix:
            'ISBN048665088X',     //after 'ISBN' hav to been ':' or space
            'ISBN:048665088X',    //after ':' have to been space
            'ISBN-10:048665088X', //after ':' have to been space
            'ISBN-13:048665088X'  //after ':' have to been space
        ];
        correctISBN.forEach( isbn => {
            expect( ISBN.Validate( isbn ) ).toBeFalsy();
        } );
    } );
} );
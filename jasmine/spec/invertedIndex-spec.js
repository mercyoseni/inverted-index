const values = require('object.values');  //  shim Object.values
//  book with valid contents
const book = require('./allBooks/books.json');
//  book with invalid content
const invalidFile = require('./allBooks/invalid.json');
//  book with valid content
const secondBook = require('./allBooks/newBook.json');
//  empty book
const empty = require('./allBooks/empty.json');
// an array
const invalid = require('./allBooks/in-valid.json');
// empty array
const emptyFile = require('./allBooks/emptyArray.json');
// an invalid JSON file
const notValid = require('./allBooks/notArrayOfArray.json');

describe('invertedIndex Index', () => {
   beforeAll(() => {
    this.invertedIndex = new InvertedIndex();
  });
  
  describe('Constructor', () => {
    it('can create instances of inverted index class', () => {
      expect(typeof this.invertedIndex)
        .toEqual('object');
      expect(this.invertedIndex instanceof InvertedIndex)
        .toBe(true);
    });
  });

  const invertedIndex = new InvertedIndex();
  invertedIndex.createIndex('book.json', book);
  invertedIndex.createIndex('secondBook.json', secondBook);

  describe('InvertedIndex class, check all methods', () => {
    it('should check that the class has a createIndex method', () => {
      expect(typeof invertedIndex.createIndex).toBe('function');
    });

    it('should check that the class has a validateFile method', () => {
      expect(typeof InvertedIndex.validateFile).toBe('function');
    });

    it('should check that the class has a tokenize method', () => {
      expect(typeof InvertedIndex.tokenize).toBe('function');
    });

    it('should check that the class has a getIndex method', () => {
      expect(typeof invertedIndex.getIndex).toBe('function');
    });

    it('should check that the class has a searchIndex method', () => {
      expect(typeof invertedIndex.searchIndex).toBe('function');
    });

    it('should check that the class has a setIndex method', () => {
      expect(typeof invertedIndex.setIndex).toBe('function');
    });
  });

  describe('validateFile should check files', () => {
    it('should check that the contents of the file to be uploaded is valid',
    () => {
      expect(InvertedIndex.validateFile(book)).toBeTruthy();
    });

    it('should return false for empty json files', () => {
      expect(InvertedIndex.validateFile(empty)).toBeFalsy();
    });

    it('should return true if file has property "title" and "text" ', () => {
      expect(InvertedIndex.validateFile(book)).toBeTruthy();
    });

    it('should return false if file does not have property "title" and "text"',
     () => {
       expect(InvertedIndex.validateFile(invalidFile)).toBeFalsy();
     });

    it('should return false if file is not an array of JSON object',
     () => {
       expect(InvertedIndex.validateFile(invalid)).toBeFalsy();
     });

    it('should return false if file is an empty array',
     () => {
       expect(InvertedIndex.validateFile(emptyFile)).toBeFalsy();
     });

    it('should return false if file is a JSON file but not' +
    'an array of an array',
     () => {
       expect(InvertedIndex.validateFile(notValid)).toBeFalsy();
     });
  });

  describe('Create Index', () => {
    it('should return a msg if index is not created', () => {
      const msg = 'Index not created';
      expect(invertedIndex.createIndex(notValid)).toEqual(msg);
    });
  });

  describe('Tokenize words', () => {
    it('should check that tokens are split and in sorted order', () => {
      let words = 'Hello Dear how are YOU';
      const expectedTokens = ['are', 'dear', 'hello', 'how', 'you'];
      words = InvertedIndex.tokenize(words);
      expect(expectedTokens).toEqual(words);
    });
  });

  describe('Generate Index', () => {
    it('should verify that index has been created', () => {
      expect(Object.keys(invertedIndex.getIndex('book.json')).length)
      .toBeGreaterThan(0);
    });

    it('should check that index maps the string to the correct objects in json'
     + ' array', () => {
      const expectedIndex = {
        and: [0, 1],
        barbie: [1],
        cindarella: [1],
        cindy: [1],
        dearie: [0],
        going: [0],
        hello: [0],
        'how\'s': [0],
        i: [0, 1],
        it: [0],
        love: [0, 1],
        you: [0]
      };
      let result = {};
      result = invertedIndex.getIndex('secondBook.json');
      expect(Object.keys(result)).toEqual(Object.keys(expectedIndex));
      expect(values(result)).toEqual(values(expectedIndex));
    });
  });

  describe('Search index', () => {
    it('should return true if search term is a string', () => {
      const words = 'I love Barbie and Alice';
      expect(Object.keys(invertedIndex.searchIndex(words, 'book.json')))
      .toBeTruthy();
    });

    it('should return true if search term is a string', () => {
      const texts = 'I love Barbie and Alice';
      expect(Object.keys(invertedIndex.searchIndex(texts, 'secondBook.json')))
      .toBeTruthy();
    });

    it('should return true if search term is a number', () => {
      let number = 1234;
      number = number.toString();
      expect(Object.keys(invertedIndex.searchIndex(number, 'secondBook.json')))
      .toBeTruthy();
    });

    it('should search through single files that are indexed', () => {
      const expectedResult = {
        'secondBook.json':
        {
          barbie: [1],
          and: [0, 1],
          cindarella: [1],
          dearie: [0]
        }
      };
      let search = {};
      search = invertedIndex.searchIndex('barbie, mercy and cindarella dearie',
      'secondBook.json');
      expect(Object.keys(search)).toEqual(Object.keys(expectedResult));
      expect(values(expectedResult)).toEqual(values(expectedResult));
    });

    it('should search through all files', () => {
      const allFiles =
        {
          'book.json':
          {
            alice: [0],
            an: [1],
            barbie: [2],
            cartoons: [2],
            of: [0, 1],
            unusual: [1],
            wizard: [1]
          },
          'secondBook.json':
          {
            barbie: [1]
          }
        };
      let search = {};
      search = invertedIndex.searchIndex('Barbie loves cartoons but she\'s' +
      'scared of an unusual wizard, alice fall\'s',
      'All files');
      expect(Object.keys(search)).toEqual(Object.keys(allFiles));
      expect(values(allFiles)).toEqual(values(allFiles));
    });
  });
});

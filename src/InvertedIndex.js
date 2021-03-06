/**
 * inverted index class
 * @class
**/
class InvertedIndex {
  /**
  * class constructor
  * @constructor
  **/
  constructor() {
    this.fileIndices = {};
  }
  /**
   * Set Index - Sets the indices of all indexed files
   * @param {String} fileName - Name of the indexed file
   * @param {Object} indices - Indices of the file
   * @return {Object} Indexed file name and it's indices'
  **/
  setIndex(fileName, indices) {
    this.fileIndices[fileName] = indices;
  }
  /**
   * Validate File
   * It checks if a json file is a json array of json objects
   * @param {Array} file is an array of json objects
   * @return {Boolean} True if a json file is valid and False otherwise
  **/
  static validateFile(file) {
    if (typeof file !== 'object' || file.length === 0 || !Array.isArray(file)) {
      return false;
    }
    for (let i = 0; i < file.length; i += 1) {
      const item = file[i];
      if (!(Object.prototype.hasOwnProperty.call(item, 'title') &&
      (Object.prototype.hasOwnProperty.call(item, 'text')) &&
      (item.title.length > 0) && (item.text.length > 0))) {
        return false;
      }
    }
    return true;
  }
  /**
    * Tokenize
    * It splits sentence into an array of refined words
    * @param {String} text - string of texts
    * @return {Array} An array of refined split texts
  **/
  static tokenize(text) {
    const remove = /[^\w'\s]|('\s)/g;
    return text.replace(remove, ' ').toLowerCase()
      .split(' ').sort()
      .filter(item => Boolean(item));
  }
  /**
   * Create Index
   * It creates the index of a file
   * @param {String} fileName - Filename of the file to be indexed
   * @param {Object} fileContent - Content of the uploaded file
   * @return {String} A message if the index is created or not
  **/
  createIndex(fileName, fileContent) {
    const indices = {};
    if (InvertedIndex.validateFile(fileContent)) {
      fileContent.forEach((document, documentIndex) => {
        const word = `${document.title} ${document.text}`;
        const tokenized = InvertedIndex.tokenize(word);
        tokenized.forEach((token) => {
          if (token in indices) {
            if (indices[token].indexOf(documentIndex) === -1) {
              indices[token].push(documentIndex);
            }
          } else {
            indices[token] = [documentIndex];
          }
        });
      });
      this.setIndex(fileName, indices);
      return 'Index created';
    }
    return 'Index not created';
  }
  /**
   * Get Index
   * It gets the index of a specified filename
   * @param {String} fileName - Filename of the index to get
   * @return {Object} An object of each word and their indices in a sorted way
  **/
  getIndex(fileName) {
    const result = {};
    const tokens = Object.keys(this.fileIndices[fileName]).sort();
    tokens.forEach((token) => {
      result[token] = this.fileIndices[fileName][token];
    });
    return result;
  }
   /**
   * Search Index
   * It searches through file(s)
   * @param {String} searchTerm - words to search
   * @param {String} fileName - Filename of the index to get
   * @return {Object} Displays table of search result
  **/
  searchIndex(searchTerm, fileName) {
    let searchResult = {};
    const searchIndices = {};
    const tokenizedTerms = InvertedIndex.tokenize(searchTerm);
    let index;
    if (fileName !== 'All files') {
      // Search single file with filename
      index = this.fileIndices[fileName];
      tokenizedTerms.forEach((term) => {
        if (index[term]) {
          searchResult[term] = index[term];
        }
      });
      searchIndices[fileName] = searchResult;
      return searchIndices;
    }
    // Search all files
    Object.keys(this.fileIndices).forEach((file) => {
      searchResult = {};
      index = this.fileIndices[file];
      tokenizedTerms.forEach((term) => {
        if (index[term]) {
          searchResult[term] = index[term];
        }
      });
      searchIndices[file] = searchResult;
    });
    return searchIndices;
  }
}

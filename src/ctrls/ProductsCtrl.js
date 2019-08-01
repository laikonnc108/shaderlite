import { bookshelf } from '../main'

export class ProductDAO {
    id
    name
    notes
    // season 
    // collection = ''

  static get INIT_DAO() {
    return { }
  }

  constructor( data ={} ){
    Object.assign(this, data)
  }
}

export class ProductsCtrl {
    /**@type {import('bookshelf').Model} */
    model
  
    constructor() {
      this.model = require('../models/ProductsModel')(bookshelf)
    }
}
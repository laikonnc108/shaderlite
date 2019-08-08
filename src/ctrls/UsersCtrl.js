import { bookshelf } from '../main'

export class UserDAO {

  id 
  name 
  username
  password
  user_type
  deleted_at
 
  static get INIT_DAO() {
    return { }
  }

  parseTypes() {

  }

  constructor (data) {
    Object.assign(this, data)
  }
}

export class UsersCtrl {
  /**@type {import('bookshelf').Model} */
  model

  constructor() {
    this.model = require('../models/UsersModel')(bookshelf)
  }
}
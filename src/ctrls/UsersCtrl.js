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

  async findAll(filter = {}) {
    let all = await this.model.where(filter).fetchAll({})
    return all.map( _=> new UserDAO(_.attributes))
  }

  async login(user = {username: null, password:null}){
    let logged_in = await this.model.where(user).fetch()
    if(logged_in)
      return new UserDAO(logged_in.toJSON())
    else
      return
  }
}
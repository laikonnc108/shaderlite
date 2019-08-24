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

  async findAll(filter = {}, options = {}) {
    let all = await this.model.where(filter).fetchAll(options)
    return all.map( _=> new UserDAO(_.attributes))
  }

  /**@param {UserDAO} data */
  async save(data) {
    data.parseTypes()
    let record = await this.model.forge(data).save()
    return record.id
  }

  async login(user = {username: null, password:null}){
    let logged_in = await this.model.where(user).fetch()
    if(logged_in)
      return new UserDAO(logged_in.toJSON())
    else
      return
  }

  async deleteById(id){
    
    let instance = await this.model.where('id',id).fetch()
    if(instance)
      return await instance.destroy()
    else
      return null
  }

  async resotreById(id) {
    let instance = await this.model.where('id',id).fetch({softDelete: false})
    instance.set('deleted_at',null)
    return await instance.save()
  }
}
import { bookshelf, knex } from "../main";
import { SuppliersCtrl, SupplierTransDAO } from "./SuppliersCtrl";

export class ReceiptDAO {
  id;
  day;
  supplier_id;
  supplier_name;
  total_nolon;
  recp_given;
  comm_rate;
  sale_value;
  net_value;
  recp_paid;
  total_current_rest;
  total_count;
  total_sell_comm;
  recp_comm;
  out_sale_value;
  recp_expenses;
  recp_others;
  recp_deducts;
  details = [];
  products_arr;
  serial;
  printed;
  balance_was;
  cashflow_id;
  cashflow_day;

  static get INIT_DAO() {
    return {
      recp_paid: 0
    };
  }

  constructor(data = {}) {
    Object.assign(this, data);
  }

  parseTypes() {
    // this.details= this.details? JSON.stringify(this.details) : null
    delete this.details;
    delete this.cashflow_day;
  }
}

export class ReceiptDetailDAO {
  id;
  receipt_id;
  day;
  supplier_id;
  kg_price;
  product_id;
  weight;
  count;

  constructor(data = {}) {
    Object.assign(this, data);
  }

  parseTypes() {}
}

export class ReceiptsCtrl {
  /**@type {import('bookshelf').Model} */
  model;
  /**@type {import('bookshelf').Collection} */
  detailsColl;

  constructor() {
    this.model = require("../models/ReceiptsModel")(bookshelf).model;
    this.detailsColl = require("../models/ReceiptsModel")(
      bookshelf
    ).detailsColl;
  }

  /**@param {ReceiptDAO} data */
  async save(data) {
    let details_arr = data.details;
    data.products_arr = details_arr.map(detail => detail.product_id).join(",");

    data.parseTypes();
    if (data.id) {
      let ok = await this.deleteDetailsById(data.id);
      console.log("ok deleted", ok);
    }
    let record = await this.model.forge(data).save();

    if (data.recp_deducts) {
      let transDAO = new SupplierTransDAO();
      transDAO.amount = -parseFloat(data.recp_deducts);
      // TODO DYNAMIC
      transDAO.trans_type = "recp_deducts";
      transDAO.sum = "-";
      transDAO.receipt_id = record.id;
      transDAO.day = data.day;
      transDAO.supplier_id = data.supplier_id;
      await new SuppliersCtrl().saveSupplierTrans(transDAO);
    }

    details_arr.forEach(item => {
      delete item.id;
      item.receipt_id = record.id;
    });

    let recp_details = this.detailsColl.forge(details_arr);
    await recp_details.invokeThen("save");

    return record.id;
  }

  /**@returns {Array} */
  async findAll(filter = {}) {
    let all = await this.model
      .where(filter)
      .fetchAll({ withRelated: ["supplier", "details","cashflow"] });
    return all.map(_ => {
      let dao = new ReceiptDAO(_.attributes);
      dao.supplier_name = _.related("supplier").get("name");
      dao.cashflow_day = _.related("cashflow").get("day");
      /**@type {Array} */
      let details = _.related("details").toJSON();
      details.forEach(record => {
        dao.details.push(new ReceiptDetailDAO(record));
      });
      //console.log('cashflow', _.related("cashflow").toJSON())
      //console.log(dao);
      // calc balance_was

      return dao;
    });
  }

  /**@returns {Array} */
  async findDailyReceipts(filter = { day: null }) {
    return await knex("v_recp_sums").where("day", filter.day);
  }

  async deleteById(id) {
    let instance = await this.model
      .where("id", id)
      .fetch({ withRelated: ["details"] });
    if (instance) {
      await instance.details().invokeThen("destroy");
      // TODO from suppliers Ctrl
      await knex.raw("delete from supplier_trans where receipt_id = " + id);
      return await instance.destroy();
    } else return null;
  }

  async deleteDetailsById(id) {
    /*
    let instance = await this.model.where('id',id).fetch({withRelated:['details']})
    console.log(instance, instance.details())
    return await instance.related('details').invokeThen('destroy')
    */
    await knex.raw("delete from receipt_details where receipt_id = " + id);
    /* */
  }
}

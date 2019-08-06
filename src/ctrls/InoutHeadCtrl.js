import {knex} from '../main'

export class InoutHeadCtrl {
    async findAll(options = { day: '' , diff : ''}){
        let results = []
        if (options.diff == '> 0' && options.day) {
            results = await knex('inout_head').where('diff', '>' , 0).andWhere('day', '<=', options.day)
        }
        else if (options.day) {
            results = await knex('inout_head').where('day', options.day)
        }
        return results
    }
}
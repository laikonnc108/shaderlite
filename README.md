# electron-vue-example

# Making vue app electronable

### Adding bootstrap

- npm i bootstrap-vue -s 
- add bootstrap scripts to app.js
```
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
```

### Get knex and bookshelf working

- npm i mssql -s
- add Object.defineProperty(knex, "name", { value: "knex" }) to avoid knex name problem

### changes to background.js

- Add window.maximize()
- Changing icon for serve in background.js main window BrowserWindow config `icon:  'assets/logo.png'`

### Adding sqlite3
```
npm install --save-dev electron-builder
npm install --save sqlite3
npm run postinstall
```
---

### Business Constrains (TO REMOVE)

- Fixed sell_comm per product / or flexi receipts
- Products can't be edited


### Business TODOS
- يجب تحصيل خصم التاجر في النقدية 
- مراجعة النوالين مع الفواتير

## Tools And Resources

- SQLiteDatabaseBrowserPortable

## Manual migration
mysql -u root -p daily_mngr < file

**Select duplicates**
SELECT name FROM customers group by name HAVING COUNT(*) > 1;

**Customers**
- remove duplicates and empty
- remove active not null and remove date_crated
```
SELECT * FROM customers where name = '';
update customers set name = 'علي السيد' where id = 175;
update customers set name = CONCAT(name, ' 2') where id = 246 or id = 223 or id = 224 or id = 66 or id = 108;

update customers set active = NULL where active = 1;
update customers set active = 1 where active = 0;
```
- rename active to deleted_at 
- export sql
- import 


**Suppliers**
- remove duplicates and empty
- remove active not null and remove date_crated, total_count and rename active to deleted_at 
```
SELECT MAX(ID),group_concat(id), group_concat(active) , any_value(name) FROM suppliers GROUP BY name HAVING count(*) > 1;
update suppliers set name = CONCAT(name, ' 2') where id = 106 or id=322 or id=468 or id=67 or id=126 or id=380 or id=73 or id=138 or id=97 or id=383 or id=22 or id=23 or id=4 or id=76 or id=74 or id=3 or id=2 or id=306 or id=273 or id=374 or id=203 or id=194 or id=110 or id=10;
update suppliers set name = CONCAT(name, ' 3') where id = 410 or id=11 or id=504 ;

update suppliers set deleted_at = NULL where deleted_at = 1;
update suppliers set deleted_at = 1 where deleted_at = 0;

```
- export sql
- import 

**Products**
- rename active to deleted_at and remove active not null , remove date_created
```
update products set name = CONCAT(name, ' P') where id = 211 or id = 7 or id = 93 or id = 31 or id = 184 or id = 127 or id = 175 or id = 5 or id = 248 or id = 233 ;
update products set name = CONCAT(name, ' PP') where id = 26 ;

update products set deleted_at = NULL where deleted_at = 1;
update products set deleted_at = 1 where deleted_at = 0;

```
- add comm
- add rahn

`update products set product_sell_comm = 6`

**Supplier_trans**
- export sql
- remove all bluff
- edit cols and datatypes 
- remove unwanted cols d_product, date_created
- create forign keys

**Customer_trans**
- add debt_was
- todo remove product_name , count also debt_after
- rename states

**Receipts**
- replace "\" to be valid json string
- update receipts set serial = 1

**Incomings**
- remove product_name, supplier_name, notes, date_created, nolon, given 
(before creating inout_head view)
- create forign keys

**outgoingd**
- remove income_header_id , sell type

**Cashflow**
- move actor_id to supplier_id / customer_id
```
update cashflow set supplier_id = actor_id where state = 'nolon' or state = 'given' or state = 'recp_paid' or state = 'supp_payment' or state = 'out_receipt' or state = 'supp_collect' 

update cashflow set customer_id = actor_id where state = 'paid' or state = 'collecting' or state = 'acc_rest' or state = 'acc_rest'
```
- rename states !
- delete cols : state_data, actor_id, actor_name , date_created

**Replaces**
double DEFAULT NULL > REAL
UNSIGNED > 
DEFAULT NULL > 

**Views**
```
CREATE VIEW out_headers 
AS
SELECT income_day, supplier_id, product_id, sum(count) as 'all_sold' FROM outgoings group by income_day,supplier_id , product_id 
```

### Lints and fixes files
```
npm run lint
```

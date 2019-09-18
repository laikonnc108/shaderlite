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
- update active NULL where = 1 / 1 where = 0 (Reverse)
- remove active not null  
- remove date_crated
```
SELECT * FROM customers where name = '';
update customers set name = 'علي السيد' where id = 175;
update customers set name = CONCAT(name, ' 2') where id = 246 or id = 223 or id = 224 or id = 66 or id = 108;
update customers set deleted_at = 1 where deleted_at = 0;
update customers set deleted_at = NULL where deleted_at = 1;
```
- rename active to deleted_at 
- export sql
- import 


**Suppliers**
```
SELECT MAX(ID), active FROM suppliers GROUP BY name HAVING count(*) > 1' and active = 0;
update suppliers set name = CONCAT(name, ' 2') where id =  322 or id =331 or id =547 or id =535 or id =550 or id =151 or id =545 or id =79 or id =539 or id =98 or id =383 or id =341 or id =104 or id =338 or id =78 or id =74 or id =339 or id =544 or id =306 or id =542 or id =528 or id =220 or id =244 or id =110 or id =533;
```
- export sql
- remove all bluff
- edit cols and datatypes (and add unique)
- update active NULL where = 1 / 1 where = 0 (Reverse)
- rename active to deleted_at

**Products**
- add comm
- add rahn

**Supplier_trans**
- export sql
- remove all bluff
- edit cols and datatypes 
- remove unwanted cols d_product, date_created
- create forign keys

**Customer_trans**
- remove product_name , count also debt_after
- rename states
- add debt_was

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

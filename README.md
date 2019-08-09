# electron-vue-example

# Making vue app electronable

### Adding bootstrap

- npm i bootstrap-vue -s 
- add bootstrap scripts to app.js
```
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
```

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

## Tools And Resources

- SQLiteDatabaseBrowserPortable

## Manual migration

**Customers**
- export from phpmyadmin as csv with no "" or NULL
- import 
- remove date_crated
- update active NULL where = 1 / 1 where = 0 (Reverse)
- rename active to deleted_at
- create forign keys

**Suppliers**
- export sql
- remove all bluff
- edit cols and datatypes (and add unique)
- update active NULL where = 1 / 1 where = 0 (Reverse)
- rename active to deleted_at

**Supplier_trans**
- export sql
- remove all bluff
- edit cols and datatypes 
- remove unwanted cols d_product, date_created
- create forign keys

**Customer_trans**
- remove product_name , count

**Incomings**
- remove product_name, supplier_name, notes, date_created, nolon, given 
(before creating inout_head view)
- create forign keys

**outgoingd**
- remove income_header_id , sell type

**Cashflow**
- move actor_id to supplier_id / customer_id
```
update cashflow set supplier_id = actor_id , actor_id = null , state_data = null where state = 'nolon' or state = 'given'

update cashflow set supplier_id = actor_id , actor_id = null , state_data = null where state = 'recp_paid' or state = 'supp_payment' or state = 'out_receipt' or state = 'supp_collect' 

update cashflow set customer_id = actor_id , actor_id = null , state_data = null where state = 'paid' or state = 'collecting' or state = 'acc_rest' or state = 'acc_rest'
```
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

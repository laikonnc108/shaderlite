-- Empty All Data
delete from cashflow;
delete from incomings;
delete from outgoings;
delete from products;
delete from receipts;
delete from receipt_details;
delete from customer_trans;
delete from customers;
delete from supplier_trans;
delete from suppliers;

-- Empty only daily data
delete from cashflow;
delete from incomings;
delete from outgoings;
delete from receipts;
delete from receipt_details;
delete from customer_trans;
delete from supplier_trans;
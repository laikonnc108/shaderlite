## Show diff in customer_trans

```
select * from 
( select *, (debt - sum_amount) diff from (select id , name, debt from customers ) customers_g
    LEFT JOIN ( select customer_id, sum(amount) as sum_amount from customer_trans group by customer_id ) customer_trans_g
    ON customers_g.id = customer_trans_g.customer_id
) allof
where allof.diff > 0 or allof.diff < 0

--
UPDATE customer_trans set amount = - (amount) where sum = '-' and amount > 0
--
UPDATE customer_trans set sum = '-' where amount < 0
UPDATE customer_trans set sum = '+' where amount > 0
```

## Select duplicates 
SELECT name FROM customers group by name HAVING COUNT(*) > 1;

## select reason trans
select *, (debt_after_prev - debt_was) diff from
(SELECT id,amount, day, debt_after , (debt_after - amount ) debt_was,
(select debt_after FROM customer_trans where customer_id = ctrns.customer_id and id < ctrns.id order by id desc limit 1) as 'debt_after_prev'
FROM customer_trans as ctrns where ctrns.customer_id = 33) ctrns_all;

## select customers with debt
    select *, (amount) sum_debt from (select * from customers ) customers_g
    LEFT JOIN ( select customer_id, sum(amount) as amount from customer_trans group by customer_id ) customer_trans_g
    ON customers_g.id = customer_trans_g.customer_id
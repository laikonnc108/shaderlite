## Show diff in customer_trans

```
select * from 
( select *, (debt - sum_amount) diff from (select id , name, debt from customers ) customers_g
    LEFT JOIN ( select customer_id, sum(amount) as sum_amount from customer_trans group by customer_id ) customer_trans_g
    ON customers_g.id = customer_trans_g.customer_id
) allof
where allof.diff > 0

--
UPDATE customer_trans set amount = - (amount) where sum = '-' and amount > 0
--
UPDATE customer_trans set sum = '-' where amount < 0
UPDATE customer_trans set sum = '+' where amount > 0
```

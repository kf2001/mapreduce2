# Map - Reduce & SQL in Javascript


The MapReduce paradigm is the basis of parallel computing frameworks like _Apache Hadoop_ that process huge amounts of data.

It's a kind of _functional programming_, where functions can be passed as arguments to other functions, which in turn return functions, and so on.

In this way, we can write very compact and elegant algorithms, although a little cryptic.

In Javascript possiamo combinare la potente programmazione funzionale con la semplicità nella gestione degli array in modo molto utile e divertente.

In Javascript we can combine the powerful of functional programming with the easygoing management of arrays and objects in a very useful and fun way.

For my examples I was inspired by typical queries in SQL, imagining as database tables some arrays of javascript objects taken from the well-known sample database "Northwind".

Please refer to other very useful articles, i.e [this](https://www.freecodecamp.org/news/15-useful-javascript-examples-of-map-reduce-and-filter-74cbbb5e0a1f), [this](https://www.freecodecamp.org/news/javascript-map-reduce-and-filter-explained-with-examples), [this](https://aulab.it/notizia/239/map-filter-e-reduce-le-3-funzioni-principali-sugli-array-in-javascript) or [this](https://michelenasti.com/2017/04/14/javascript-filter-map-reduce.html), for the basic explanations of the functions map(), reduce(), filter(), sort(), the Set() object, and the Spread operator [...].


You can download all the files from [GitHub](https://github.com/kf2001/mapreduce2.git)


### BASI OPERATIONS ON THE TABLES

##### PROJECTION

##### The _projection_ is a filtering on the columns

###### For example, from the **CUSTOMERS** table we want to display only some fields

 * SQL 

        SELECT id, companyName, country 
        FROM clients

   
* Javascript
  
        let projection = clients.map(c=>new Object({"id":c.id,"companyName": c.companyName, "country":c.country }));


#### SELECTION

 ##### the _selection_ is a filtering on the rows

###### From table **CUSTOMERS** we only want customers who come from UK

 * SQL 

        SELECT *
        FROM clients
        WHERE country = "UK"

   
* Javascript
  
       let selez = clients.filter(cc=>cc.country=="UK")

#### CARTESIAN PRODUCT

##### the Cartesian Product between two sets is given by all the elements of A combined with each element of B

* JS
  
        let a = ['a', 'b', 'c', 'd']
        let b = [1, 2, 3]

        let prod = [].concat(...a.map(p => b.map(b => p + b)))

        /* [
            'a1', 'a2', 'a3',
            'b1', 'b2', 'b3',
            'c1', 'c2', 'c3',
            'd1', 'd2', 'd3'
        */  ] 

### DISTINCT CLAUSE

##### Retrieves only distinct (unique) values in a specified list of columns: in Javascript we can use the Set() object
###### List of countries in the clients table

 * SQL 

        SELECT DISTINCT country 
        FROM clients
        ORDER BY country

   
* Javascript
  
       const distinct = Array.from(new Set(clients.map(cc => cc.country)))




### SORTING

##### To sort the records we use the sort() function

* SQL 
  
        SELECT * 
        FROM clients 
        ORDER BY companyName
* JS
  
        let sorted = clients.sort((a,b)=> ( b.companyName < a.companyName));

    

### AGGREGATION FUNCTONS

#### COUNT
##### _Total amount of clients_

* SQL 
  
        SELECT COUNT(*) 
        FROM clients
* JS
  
        let clients_amount = clients.reduce((count, val) => count + 1, 0);
    

#### SUM


###### _Total products in stock_

* SQL 
  
        SELECT SUM(unitsInStock) 
        FROM products
* JS
  
       let totp = products.map(prod => prod.unitsInStock).reduce((sum, cc) => sum + cc, 0);
        
        //or
        
        let totp_alt = products.reduce((sum, prod) => sum + prod.unitsInStock, 0);


#### MAX

###### _Highest price of all products_

* SQL 
  
        SELECT MAX(unitPrice)
        FROM products
* JS
  
        const maxPrice = products.map(cc => cc.unitPrice).reduce((max, d) => d > max ? d : max);


#### MIN

###### _Lowest price_

* SQL 
  
        SELECT MIN(unitPrice)
        FROM products
* JS
  
        const minPrice = products.map(cc => cc.unitPrice).reduce((min, d) => d < min ? d : min);


#### AVG

###### _Average price_

* SQL 
  
        SELECT AVG(unitPrice)
        FROM products
* JS
  
        const avgPrice = products.map(cc => cc.unitPrice).reduce( (r, p) =>{ r.sum += p; ++r.count; return r }, { count: 0, sum: 0 });
c

#### TOP N

###### _The ten most expensive products_

* SQL 
  
        SELECT TOP 10(unitPrice) 
        FROM products

* JS
  
        const topN = products.sort( (a, b) =>  a.unitPrice - b.unitPrice ).reverse().slice(0, 10)



### GROUP BY

###### _Total products for each category_

* SQL 
  
        SELECT categoryId, COUNT(*) 
        FROM products
        GROUP BY(categoryId)

* JS
  
        const groupByCategory = products.reduce((groups, cc) => {
        groups[cc.categoryId] = (groups[cc.categoryId] || 0) + 1;
        return groups;
        }, {})

###### _Total customers for each country_

* SQL 
  
        SELECT country, COUNT(*)
        FROM customers
        GROUP BY(country)

* JS
  
        const groupByCustomersCountry = customers.reduce((gruppi, cc) => {groups[cc.country] = (groups[cc.country] || 0) + 1; return groups;}, {})

    then sort by total customers

        let filtra = Object.entries(groupByCustomersCountry).map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n)


###### _Total orders for each customer (minimum 5)_

* SQL 
  
        SELECT customerId, count(*)
        FROM orders
        GROUP BY customerId 
        HAVING count(*) >= 5
        ORDER BY count(*) DESC

* JS
  
        const OrdersgroupByCustomer = Object.entries(orders.reduce((groups, cc) => {
        groups[cc.customerId] = (groups[cc.customerId] || 0) + 1;
        return gruppi;
        }, {}))
        .map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n)
        .filter(o => o.n >= 5)


    

### Other typical Hadoop functions
    
#### Binning

#####  Splits records based on criteria
###### Example: split products into 4 categories based on price 

* JS
  
        const categ = products.reduce((cate, cc) => {
        let pr = parseInt(cc.unitPrice)
        if (pr < 4) cate["very_cheap"].push(cc)
        else if (pr < 10) cate["cheap"].push(cc)
        else if (pr < 50) cate["expensive"].push(cc)
        else cate["luxury"].push(cc)
        return cate;
        }, { very_cheap: [], cheap: [], expensive: [], luxury: [] })

### Inverted Index

#### It is used to create dictionary-like structures
##### Example 1: for each month, provide the list of customers who have placed at least one order

* JS

        const invIndex = orders.reduce((months, ord) => {
        let year=new Date(ord.orderDate).getFullYear()
        let month=new Date(ord.orderDate).getMonth()
        let key=month+"-"+year
        months[key] = (months[key] || new Set()).add(ord.customerId);
        return months;
        }, {})

##### Example 2: for each customer provide the dates of the orders

* JS
  
        const invIndex2 = orders.reduce((order_dates, cc) => {
        order_dates[cc.customerId] = (order_dates[cc.customerId] || new Set()).add(cc.orderDate.substr(0,10));
        return order_dates;
        }, {})    



---

### JOINS
#### Combine two or more tables that relate through one or more columns

#### LEFT OUTER JOIN

##### _filters all values in the first table even if they don't match in the second table_

* SQL
  
        SELECT * 
        FROM products
        LEFT JOIN categories
        ON products.categoryId = categories.id;
 
* JS

        const left_join = products.reduce((loj, pp) => {
        let lookup_cat = categories.filter(cc => pp.categoryId == cc.idCat);
        let union_rec
        if (lookup_cat.length) union_rec = { ...pp, ...lookup_cat[0] }; else union_rec = pp;
        loj.push(union_rec)
        return loj;
        }
        , [])



#### RIGHT OUTER JOIN
##### _conserva tutti i valori della seconda tabella anche se non hanno corrispondenza nella prima_
##### _retains all values from the second table even if they don't match the first_

* SQL
  
        SELECT * 
        FROM categories
        LEFT OUTER JOIN products
        ON categories.id= products.categoryId;

 * JS

        const right_join = categories.reduce((roj, cc) => {
        let lookup_prod = products.filter(pp => pp.categoryId == cc.idCat);
        if (lookup_prod.length == 0) roj.push(cc); else {
        lookup_prod.map(v => {
        let union_rec = { ...cc, ...v }
        roj.push(union_rec)
        })
        }
        return roj;
        }, [])


#### INNER JOIN (NATURAL JOIN)
##### _Inner Join and Natural Join are very similar - only the number of columns returned changes_
##### _In this solution we first make the Cartesian product between the two tables and then filter only the records with the same "hinge" column values_

* SQL
  
        SELECT * 
        FROM products, categories
        WHERE products.categoryId = categorie.id;

* JS

        let prod_cart = [].concat(...products.map(pp => categories.map(cc => Object.assign({}, { ...pp, ...cc }))))
        
        let natjoin = prod_cart.filter(f => (f.categoryId == f.idCat))



 ### SUBQUERY

 ##### Example 1: list of customers who have placed at least one order 

 * SQL
  
        SELECT *
        FROM customers
        WHERE id IN ( SELECT customerId FROM orders)
) 

* JS

        const customer_list=customers.filter(cl=>orders.filter(oo=>oo.customerId=cl.idCli))

 ##### Example 2:list of products that have been ordered at least once in quantities greater than 100 units 

 * SQL
  
        SELECT DISTINCT idProd as id, nome as descr
        FROM products 
        WHERE productId IN (SELECT productId from details WHERE quantity>100)

-%--


 ##### Example 3: list of orders that include products of at least two different categories 

 * SQL
  
        SELECT Details.OrderId, (SELECT COUNT( DISTINCT categoryId)) as ncat 
        FROM Details, Products
        WHERE Details.ProductId=Products.ProductId
        GROUP BY Details.OrderId
        HAVING ncat>1


* JS

        const groupByCat = (details.reduce((groups, cc) => {
        var prod=[]
        cc.products.forEach(pp=>prod.push(rispc[pp.productId]))
        let diversi=new Set(prod).size 
        if(diversi>1) groups.push(new Object({"ord":cc.orderId, "det":prod.length, "div":diversi}));
        return groups;
        }, []))








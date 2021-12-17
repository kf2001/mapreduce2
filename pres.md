
# Map - Reduce & SQL in Javascript


 Il paradigma MapReduce è alla base di framework di calcolo parallelo come _Apache Hadoop_ per elaborare enormi quantità di dati.

 Si fonda su un tipo di programmazione funzionale, dove cioè si possono passare funzioni come argomento di altre funzioni, che a loro volta restituiscono funzioni, e così via.

In questo modo si possono scrivere algoritmi molto compatti ed eleganti, anche se, all'inizio, un po' criptici.

In Javascript possiamo combinare la potente programmazione funzionale con la semplicità nella gestione degli array in modo molto utile e divertente.

Per gli esempi utilizzati mi sono ispirato a delle tipiche query in SQL, immaginando come tabelle di database degli array di oggetti javascript creati con l'aiuto di [_mockaroo_](https://mockaroo.com)

Rimando ad altri ottimi articoli, come [questo](https://www.freecodecamp.org/news/15-useful-javascript-examples-of-map-reduce-and-filter-74cbbb5e0a1f), [questo](https://www.freecodecamp.org/news/javascript-map-reduce-and-filter-explained-with-examples), [questo](https://aulab.it/notizia/239/map-filter-e-reduce-le-3-funzioni-principali-sugli-array-in-javascript) o [questo](https://michelenasti.com/2017/04/14/javascript-filter-map-reduce.html), l'uso di map(), reduce(), filter(), sort(), Set(), operatore Spread [...].





### OPERAZIONI FONDAMENTALI SULLE TABELLE

##### PROIEZIONE

##### La _proiezione_ è un filtraggio sulle colonne

###### Ad esempio della tabella **CARS** vogliamo visualizzare solo alcuni campi

 * SQL 

        SELECT casa, modello, anno 
        FROM CARS

   
* Javascript
  
        let proiez = cars.map(c=>new Object({"casa":c.casa,"modello": c.modello, "anno":c.anno }));


#### SELEZIONE

 ##### la _selezione_ è un filtraggio sulle righe

###### Della tabella **CARS** vogliamo solo i modelli con meno di 5 unità disponibili

 * SQL 

        SELECT *
        FROM cars
        WHERE dispo < 5

   
* Javascript
  
       let selez = cars.filter(cc=>cc.dispo < 5)

#### PRODOTTO CARTESIANO

##### il prodotto cartesiano fra due insiemi è dato da tutti gli elementi di A combinati con ogni elemento di B

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

### DISTINCT

##### Eliminare i record uguali
###### Elenco delle case automobilistiche

 * SQL 

        SELECT DISTINCT casa 
        FROM CARS 
        ORDER BY casa

   
* Javascript
  
       const distinct = Array.from(new Set(cars.map(cc => cc.casa))).sort()




### SORTING

##### Per ordinare i record usiamo la funzione sort

* SQL 
  
        SELECT * 
        FROM CARS 
        ORDER BY prezzo
* JS
  
        let sorted = cars.sort((a,b)=> ( b.prezzo - a.prezzo ));
    

### FUNZIONI DI AGGREGAZIONE

#### COUNT
##### Numero totale di autovetture

* SQL 
  
        SELECT COUNT(*) 
        FROM CARS
* JS
  
        let totcars = cars.map(cc => cc.dispo).reduce((sum, cc) => sum + cc, 0);
    oppure

        let totcars = cars.reduce((sum, cc) => sum + cc.dispo, 0);

#### SUM


###### _Totale macchine disponibili_

* SQL 
  
        SELECT SUM(dispo) 
        FROM CARS
* JS
  
        let totdispo = cars.reduce((sum, cc) => sum + cc.dispo, 0);

#### MAX

###### _Prezzo più alto_

* SQL 
  
        SELECT MAX(prezzo)
        FROM CARS
* JS
  
        const maxPrezzo = cars.map(cc => cc.prezzo).reduce((max, d) => d > max ? d : max);

#### MIN

###### _Prezzo più basso_

* SQL 
  
        SELECT MIN(prezzo)
        FROM CARS
* JS
  
        const minPrezzo = cars.map(cc => cc.prezzo).reduce((min, d) => d < min ? d : min);

#### AVG

###### _Prezzo medio_

* SQL 
  
        SELECT AVG(prezzo)
        FROM CARS
* JS
  
        const avgPrezzo = cars.map(cc => cc.prezzo).reduce( (r, p) =>{ r.sum += p; ++r.count; return r }, { count: 0, sum: 0 });


#### TOP N

###### _Le dieci macchine più costose_

* SQL 
  
        SELECT TOP 10(prezzo)
        FROM cars

* JS
  
        const topN = cars.sort((a, b) =>  a.prezzo - b.prezzo).reverse().slice(0, 10)


### GROUP BY

###### _Numero di vetture per ogni casa automobilistica_

* SQL 
  
        SELECT casa, COUNT(*)
        FROM CARS
        GROUP BY(casa)

* JS
  
        const groupByCasa = cars.reduce((gruppi, cc) => { gruppi[cc.casa] = (gruppi[cc.casa] || 0) + 1;  return gruppi;}, {})

###### _Numero di clienti per Paese_

* SQL 
  
        SELECT country, COUNT(*)
        FROM CLIENTI 
        GROUP BY(country)

* JS
  
        const groupClientiByCountry = clienti.reduce((gruppi, cc) => {gruppi[cc.country] = (gruppi[cc.country] || 0) + 1; return gruppi;}, {})

    poi ordinare in base al numero di clienti

        let filtra = Object.entries(groupByClientiCountry).map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n)


#### _Numero di ordini per cliente (almeno 5)_

* SQL 
  
        SELECT customerId, count(*)
        FROM ORDINI
        GROUP BY customerId 
        HAVING count(*) >= 5
        ORDER BY count(*) DESC

* JS
  
        const OrdinigroupByCliente = Object.entries(ordini.reduce((gruppi, cc) => {
        gruppi[cc.customerId] = (gruppi[cc.customerId] || 0) + 1;
        return gruppi;
        }, {}))
        .map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n)
        .filter(o => o.n >= 5)


    

### Binning

#### Suddivide i record in base ad un criterio
##### Esempio: suddividere le auto in 5 categorie in base al prezzo

* JS
  
        const categ = cars.reduce((cate, cc) => {
        let pr = parseInt(cc.prezzo)
        if (pr < 20000) cate["piccole"].push(cc)
        else if (pr < 30000) cate["medie"].push(cc)
        else if (pr < 50000) cate["grandi"].push(cc)
        else if (pr < 70000) cate["lusso"].push(cc)
        else cate["extralusso"].push(cc)
        return cate;
        }, { piccole: [], medie: [], grandi: [], lusso: [], extralusso: [] })

### Indice invertito

#### Si usa per creare strutture tipo dizionario
##### Esempio: per ogni anno fornire l'elenco delle case presenti con almeno una vettura

* JS

        const invIndex = cars.reduce((anni, cc) => {
        anni[cc.anno] = (anni[cc.anno] || new Set()).add(cc.casa);
        return anni;
        }, {})

##### Esempio: per ogni casa fornire l'elenco degli anni relativi alle vetture

* JS
  
        const invIndex2 = cars.map(cc => new Object({ casa: cc.casa, anno: cc.anno })).reduce((casa, cc) => {
        casa[cc.casa] = (casa[cc.casa] || new Set()).add(cc.anno);
        return casa;
        }, {})     



---

### JOINS
#### Combinare due o più tabelle che si relazionano attraverso una o più colonne

#### LEFT OUTER JOIN

* SQL
  
        SELECT * 
        FROM prodotti
        LEFT JOIN categorie
        ON prodotti.categoryId = categorie.id;
 
* JS

        const left_join = prodotti.reduce((loj, pp) => {
        let lookup_categoria = categorie.filter(cc => pp.categoryId == cc.idCat);
        let union_rec
        if (lookup_categoria.length) union_rec = { ...pp, ...lookup_categoria[0] }; else union_rec = pp;
        loj.push(union_rec)
        return loj;
        }
        , [])



#### RIGHT OUTER JOIN
##### la Right Outer Join è equivalente alla Left Outer Join scambiando le tabelle

* SQL
  
        SELECT * 
        FROM categorie
        LEFT OUTER JOIN prodotti
        ON categorie.id= prodotti.categoryId;

 * JS

        const right_join = categorie.reduce((roj, cc) => {
        let lookup_prodotti = prodotti.filter(pp => pp.categoryId == cc.idCat);
        if (lookup_prodotti.length == 0) roj.push(cc); else {
        lookup_prodotti.map(v => {
        let union_rec = { ...cc, ...v }
        roj.push(union_rec)
        })
        }
        return roj;
        }, [])


#### INNER JOIN (NATURAL JOIN)
##### 

* SQL
  
        SELECT * 
        FROM prodotti, categorie
        WHERE prodotti.categoryId = categorie.id;

* JS

        let prod_cart = [].concat(...prodotti.map(pp => categorie.map(cc => Object.assign({}, { ...pp, ...cc }))))
        
        let natjoin = prod_cart.filter(f => (f.categoryId == f.idCat))



 









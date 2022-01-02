### MapReduce & SQL in Javascript


 Il paradigma MapReduce è alla base di framework di calcolo parallelo come _Apache Hadoop_ per elaborare enormi quantità di dati.

 Si fonda su un tipo di _programmazione funzionale_, dove cioè si possono passare funzioni come argomento di altre funzioni, che a loro volta restituiscono funzioni, e così via.

In questo modo si possono scrivere algoritmi molto compatti ed eleganti, anche se un po' criptici.

-%-

In Javascript possiamo combinare la potente programmazione funzionale con la semplicità nella gestione degli array in modo molto utile e divertente.

Per gli esempi utilizzati mi sono ispirato a delle tipiche query in SQL, immaginando come tabelle di database degli array di oggetti javascript creati con l'aiuto di [_mockaroo_](https://mockaroo.com).
Rimando ad altri ottimi articoli, come [questo](https://www.freecodecamp.org/news/15-useful-javascript-examples-of-map-reduce-and-filter-74cbbb5e0a1f), [questo](https://www.freecodecamp.org/news/javascript-map-reduce-and-filter-explained-with-examples), [questo](https://aulab.it/notizia/239/map-filter-e-reduce-le-3-funzioni-principali-sugli-array-in-javascript) o [questo](https://michelenasti.com/2017/04/14/javascript-filter-map-reduce.html), la spiegazione dell'uso di map(), reduce(), filter(), sort(), Set(), l'operatore Spread [...].

Puoi scaricare tutti i file da [GitHub](https://github.com/kf2001/mapreduce2.git)

-%--

### OPERAZIONI FONDAMENTALI SULLE TABELLE

##### PROIEZIONE
##### La _proiezione_ è un filtraggio sulle colonne: ad esempio della tabella **CLIENTI** vogliamo visualizzare solo alcuni campi



* SQL 

        SELECT id, companyName, country 
        FROM clienti
   
* Javascript
  
       let proiez = clienti.map(c=>new Object({"id":c.id,"companyName": c.companyName, "country":c.country }));



-%-
#### SELEZIONE

 ##### la _selezione_ è un filtraggio sulle righe

###### Della tabella **CLIENTI** vogliamo solo quelli provenienti dal Regno Unito





* SQL 

        SELECT *
        FROM clienti
        WHERE country = "UK"
   
* Javascript
  
       let selez = clienti.filter(cc=>cc.country=="UK")




-%-

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

-%--

### CLAUSOLA DISTINCT

##### Elimina i record uguali: in Javascript possiamo usare l'oggetto Set()
###### Elenco dei Paesi rappresentati

* SQL 

        SELECT DISTINCT country 
        FROM clienti 
        ORDER BY country
   
* Javascript
  
       const distinct = Array.from(new Set(clienti.map(cc => cc.country))).sort()


-%-

### SORTING

##### Per ordinare i record usiamo la funzione sort

* SQL 
  
        SELECT * 
        FROM clienti 
        ORDER BY companyName
* JS
  
        let sorted = clienti.sort((a,b)=> ( b.companyName < a.companyName));

-%--

### FUNZIONI DI AGGREGAZIONE

#### COUNT
##### _Numero totale di clienti_

* SQL 
  
        SELECT COUNT(*) 
        FROM clienti
* JS
  
        let numero_clienti = clienti.reduce((count, val) => count + 1, 0);

-%-

#### SUM


###### _Totale prodotti in magazzino_

* SQL 
  
        SELECT SUM(unitsInStock) 
        FROM prodotti
* JS
  
       let totp = prodotti.map(prod => prod.unitsInStock).reduce((sum, cc) => sum + cc, 0);
        
        //oppure
        
        let totp_alt = prodotti.reduce((sum, prod) => sum + prod.unitsInStock, 0);

-%-

#### MAX

###### _Prezzo più alto_

* SQL 
  
        SELECT MAX(unitPrice)
        FROM prodotti
* JS
  
        const maxPrezzo = prodotti.map(cc => cc.unitPrice).reduce((max, d) => d > max ? d : max);


-%-

#### MIN

###### _Prezzo più basso_

* SQL 
  
        SELECT MIN(unitPrice)
        FROM prodotti
* JS
  
        const minPrezzo = prodotti.map(cc => cc.unitPrice).reduce((min, d) => d < min ? d : min);

-%-

#### AVG

###### _Prezzo medio_

* SQL 
  
        SELECT AVG(unitPrice)
        FROM prodotti
* JS
  
        const avgPrezzo = prodotti.map(cc => cc.unitPrice).reduce( (r, p) =>{ r.sum += p; ++r.count; return r }, { count: 0, sum: 0 });

-%-

#### TOP N

###### _I dieci prodotti più costosi_

* SQL 
  
        SELECT TOP 10(unitPrice) 
        FROM prodotti

* JS
  
        const topN = prodotti.sort( (a, b) =>  a.unitPrice - b.unitPrice ).reverse().slice(0, 10)


-%--

### GROUP BY

###### _Numero di prodotti per ogni categoria_

* SQL 
  
        SELECT categoryId, COUNT(*) 
        FROM prodotti
        GROUP BY(categoryId)

* JS
  
        const groupByCategory = prodotti.reduce((gruppi, cc) => {
        gruppi[cc.categoryId] = (gruppi[cc.categoryId] || 0) + 1;
        return gruppi;
        }, {})

-%-

###### _Numero di clienti per Paese_

* SQL 
  
        SELECT country, COUNT(*)
        FROM CLIENTI 
        GROUP BY(country)

* JS
  
        const groupClientiByCountry = clienti.reduce((gruppi, cc) => {gruppi[cc.country] = (gruppi[cc.country] || 0) + 1; return gruppi;}, {})

    poi ordinare in base al numero di clienti

        let filtra = Object.entries(groupByClientiCountry).map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n)

-%-

###### _Numero di ordini per cliente (almeno 5)_

* SQL 
  
        SELECT customerId, count(*)
        FROM ordini
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

-%--

### Altre funzioni tipiche di Hadoop
    
#### Binning

#####  Suddivide i record in base ad un criterio
###### Esempio: suddividere i prodotti in 4 categorie in base al prezzo

* JS
  
        const categ = prodotti.reduce((cate, cc) => {
        let pr = parseInt(cc.unitPrice)
        if (pr < 4) cate["molto_economici"].push(cc)
        else if (pr < 10) cate["economici"].push(cc)
        else if (pr < 50) cate["costosi"].push(cc)
        else cate["lusso"].push(cc)
        return cate;
        }, { molto_economici: [], economici: [], costosi: [], lusso: [] })

-%-

#### Indice invertito

##### Si usa per creare strutture tipo dizionario

###### Esempio: per ogni mese fornire l'elenco dei clienti che hanno effettuato almeno un ordine

* JS

        const invIndex = ordini.reduce((mesi, ord) => {
        let anno=new Date(ord.orderDate).getFullYear()
        let mese=new Date(ord.orderDate).getMonth()
        let key=mese+"-"+anno
        mesi[key] = (mesi[key] || new Set()).add(ord.customerId);
        return mesi;
        }, {})

-%-

###### Esempio: per ogni cliente fornire le date degli ordini

* JS
  
        const invIndex2 = ordini.reduce((date_ordini, cc) => {
        date_ordini[cc.customerId] = (date_ordini[cc.customerId] || new Set()).add(cc.orderDate.substr(0,10));
        return date_ordini;
        }, {})    



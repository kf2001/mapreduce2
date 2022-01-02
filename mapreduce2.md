
### JOINS

#### Combinare due o più tabelle che si relazionano attraverso una o più colonne

#### LEFT OUTER JOIN

##### _filtra tutti i valori della prima tabella anche se non hanno corrispondenza nella seconda tabella_

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

-%-

#### RIGHT OUTER JOIN
##### _conserva tutti i valori della seconda tabella anche se non hanno corrispondenza nella prima_
##### _la Right Outer Join è equivalente alla Left Outer Join scambiando le tabelle_

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

-%-

#### INNER JOIN (NATURAL JOIN)
_Inner Join e Natural Join sono molto simili: cambia solo il numero di colonne restituite_.
_Con questa soluzione facciamo prima il prodotto cartesiano tra le due tabelle e poi filtriamo solo i record con i valori della colonna "cerniera" uguali_

* SQL
  
        SELECT * 
        FROM prodotti, categorie
        WHERE prodotti.categoryId = categorie.id;

* JS

        let prod_cart = [].concat(...prodotti.map(pp => categorie.map(cc => Object.assign({}, { ...pp, ...cc }))))
        
        let natjoin = prod_cart.filter(f => (f.categoryId == f.idCat))

-%--

### SUBQUERY
##### Esempio: elenco dei clienti che hanno fatto almeno un ordine 

* SQL
  
        SELECT *
        FROM clienti
        WHERE id IN ( SELECT customerId FROM ordini)

* JS

         const elenco=clienti.filter(cl=>ordini.filter(oo=>oo.customerId=cl.idCli))

-%-

##### Esempio:  elenco dei prodotti che sono stati ordinati almeno una volta in quantità superiore a 100 

* SQL
  
        SELECT DISTINCT idProd as id, nome as descr
        FROM prodotti 
        WHERE productId IN (SELECT productId from dettagli WHERE quantity>100)

* JS

         let prod=dettagli.map(d=>d.prodotti.flat()).reduce((acc, val) => acc.concat(val), []).
         filter(v=>v.quantity>100).map(pp=>pp.productId)
        let proj=prodotti.filter(pp=>prod.includes(pp.idProd))
        .map(p=>new Object({"id":p.idProd, "descr":p.name}))

-%-

##### Esempio:  elenco degli ordini che comprendono prodotti di almeno due categorie diverse

* SQL
  
        SELECT idOrdine, SELECT count(*) DISTINCT categorie from prodotti,categorie) as diverse
        FROM dettagli 
        WHERE diverse >= 2
        GROUP BY idOrdine

* JS

        const groupByCat = (dettagli.reduce((gruppi, cc) => {
        var prod=[]
        cc.prodotti.forEach(pp=>prod.push(rispc[pp.productId]))
        let diversi=new Set(prod).size
 
        if(diversi>1) gruppi.push(new Object({"ord":cc.orderId, "det":prod.length, "div":diversi}));
        return gruppi;
        }, []))








-%--


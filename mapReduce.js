
// JAVASCRIPT MAP REDUCE & SQL




const prodotti = require("./prodotti")
const categorie = require("./categorie")
const ordini = require("./ordini")
const dettagli = require("./dettagli")
const clienti = require("./clienti")



//Le operazioni fondamentali su una tabella sono la proiezione e la selezione

//Proiezione
console.log("Proiezione")
//SELECT id, companyName, country FROM clienti

console.log("SELECT id, companyName, country FROM clienti")
let proiez = clienti.map(c=>new Object({"id":c.id,"companyName": c.companyName, "country":c.country })).slice(0,20);
console.table(proiez)

//Selezione
console.log("Selezione")
/*SELECT *
 FROM clienti
 WHERE country = "UK"
*/
console.log("SELECT * FROM clienti WHERE country = 'UK'")
let selez = clienti.filter(cc=>cc.country=="UK")

console.table(selez)

//SORTING
console.log("Sorting")

/*
SELECT * 
FROM clienti 
ORDERBY companyName
*/

let sorted = clienti.sort((a,b)=> ( b.companyName < a.companyName)).slice(0,20);
console.log("SELECT * FROM clienti ORDERBY companyName")
console.table( sorted)



//------------------------------------

// Funzioni di aggregazione
// count

//SELECT COUNT(*) FROM clienti

let numero_clienti = clienti.reduce((count, val) => count + 1, 0);
console.log("SELECT COUNT(*) FROM clienti", numero_clienti)

//---------------------------------

// Totale prodotti in magazino

//SELECT SUM(unitsInStock) FROM prodotti


let totp = prodotti.map(prod => prod.unitsInStock).reduce((sum, cc) => sum + cc, 0);
//oppure
let totp_alt = prodotti.reduce((sum, prod) => sum + prod.unitsInStock, 0);

console.log("SELECT SUM(unitsInStock) FROM prodotti", totp)
console.log("SELECT SUM(unitsInStock) FROM prodotti", totp_alt)


// --------------------------------------------------

//max-min


//SELECT MAX(unitPrice) FROM prodotti

const maxPrezzo = prodotti.map(cc => cc.unitPrice).reduce((max, d) => d > max ? d : max);
console.log("SELECT MAX(unitPrice) FROM prodotti", maxPrezzo)

//SELECT MIN(unitPrice) FROM prodotti

const minPrezzo = prodotti.map(cc => cc.unitPrice).reduce((min, d) => d < min ? d : min);
console.log("SELECT MIN(unitPrice) FROM prodotti", minPrezzo)


// Average
//SELECT AVG(unitPrice) FROM prodotti
const avgPrezzo = prodotti.map(cc => cc.unitPrice).reduce( (r, p) =>{ r.sum += p; ++r.count; return r }, { count: 0, sum: 0 });
console.log("SELECT AVG(unitPrice) FROM prodotti:", avgPrezzo.sum / avgPrezzo.count)

// TopN
const topN = prodotti.sort( (a, b) =>  a.unitPrice - b.unitPrice ).reverse().slice(0, 10)
console.log("SELECT TOP 10(unitPrice) FROM prodotti:")
console.table(topN) 



// Filter 

//GroupBy

//SELECT categoryId, COUNT(*) FROM prodotti GROUP BY(categoryId)

const groupByCategory = prodotti.reduce((gruppi, cc) => {
  gruppi[cc.categoryId] = (gruppi[cc.categoryId] || 0) + 1;
  return gruppi;
}, {})

console.table(groupByCategory)

// SELECT country, COUNT(*) FROM clienti GROUP BY(country)

const groupByClientiCountry = clienti.reduce((gruppi, cc) => {

  gruppi[cc.country] = (gruppi[cc.country] || 0) + 1;
  return gruppi;
}, {})



console.table(groupByClientiCountry)

/* 
console.table("oppure")
console.table(Object.entries(groupByClientiCountry)) */
let oo = Object.entries(groupByClientiCountry).map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n)
 console.log("SELECT country, COUNT(*) FROM clienti GROUP BY(country) SORT BY country")
console.table(oo)/* */

// numero di ordini per cliente

//SELECT customerId, count(*) FROM ordini GROUP BY customerId HAVING count(*)>=5 ORDER BY count(*) DESC


const OrdinigroupByCliente = Object.entries(ordini.reduce((gruppi, cc) => {

  gruppi[cc.customerId] = (gruppi[cc.customerId] || 0) + 1;
  return gruppi;
}, {})).map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n).filter(o => o.n >= 5)


console.log("SELECT customerId, count(*) FROM ordini GROUP BY customerId HAVING count(*)>=5 ORDER BY count(*) DESC")
console.table(OrdinigroupByCliente)

// Distinct


// SELECT DISTINCT country FROM clienti ORDER BY country
const distinct = Array.from(new Set(clienti.map(cc => cc.country))).sort()
console.log("SELECT DISTINCT country FROM clienti ORDER BY country")
console.log(distinct)

// Binning

// Suddivide i record in base ad un criterio


const categ = prodotti.reduce((cate, cc) => {

  let pr = parseInt(cc.unitPrice)
  if (pr < 4) cate["molto_economici"].push(cc)
  else if (pr < 10) cate["economici"].push(cc)
  else if (pr < 50) cate["costosi"].push(cc)
 
  else cate["lusso"].push(cc)
  return cate;
}, { molto_economici: [], economici: [], costosi: [], lusso: [] })

/*  console.log("molto_economici")
console.table(categ.molto_economici)

console.log("economici")
console.table(categ.economici)

console.log("costosi")
console.table(categ.costosi)

console.log("lusso")
console.table(categ.lusso)
*/



// Inverted Index


// PER OGNI MESE FORNIRE L'ELENCO DEI CLIENTI PRESENTI CON ALMENO UN ORDINE
const invIndex = ordini.reduce((mesi, ord) => {

  let anno=new Date(ord.orderDate).getFullYear()
  let mese=new Date(ord.orderDate).getMonth()
  let key=mese+"-"+anno
  mesi[key] = (mesi[key] || new Set()).add(ord.customerId);
  return mesi;
}, {})

console.log(invIndex)

// PER OGNI CLIENTE FORNIRE LE DATE DEGLI ORDINI
const invIndex2 = ordini.reduce((date_ordini, cc) => {
  date_ordini[cc.customerId] = (date_ordini[cc.customerId] || new Set()).add(cc.orderDate.substr(0,10));
  return date_ordini;
}, {})


console.log(invIndex2)


////Joins
console.log("JOINS")

// Left Outer J
/* 
SELECT * 
FROM prodotti
LEFT JOIN categorie
ON prodotti.categoryId= categorie.id;
 */
console.log("LEFT OUTER JOIN")



var left_join = prodotti.reduce((loj, pp) => {

  let lookup_categoria = categorie.filter(cc => pp.categoryId == cc.idCat);

  let union_rec
  if (lookup_categoria) union_rec = { ...pp, ...lookup_categoria[0] }; else union_rec = pp;
  loj.push(union_rec)
  return loj;
}
  , [])

//console.table(left_join)

console.log(left_join.length)



//Left Outer J

/*
SELECT * 
FROM prodotti
LEFT JOIN prodotti
ON categorie.id= prodotti.categoryId;
 */
console.log("RIGHT OUTER JOIN")


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


//console.table(right_join)

console.log(right_join.length)



// prodotto cartesiano

let a = ['a', 'b', 'c', 'd']
let b = [1, 2, 3]

let f = [].concat(...a.map(p => b.map(b => p + b)))

/* f = [
  'a1', 'a2', 'a3',
  'b1', 'b2', 'b3',
  'c1', 'c2', 'c3',
  'd1', 'd2', 'd3'
] 
*/
console.log(f)
//let f =  [].concat(...a.map(a => b.map(b => [a+b]))).reduce((acc, val) => acc.concat(val), []);

console.log("INNER JOIN")
// INNER JOIN
/*
SELECT * 
FROM prodotti, categorie
WHERE prodotti.categoryId=categorie.id;
 */



//let np = prodotti_.reduce(function (acc, p) { let no = {}; Object.entries(p).forEach(([key, value]) => no[key + "__"] = value); return acc.concat(no) }, [])

let prod_cart = [].concat(...prodotti.map(pp => categorie.map(cc => Object.assign({}, { ...pp, ...cc }))))

//console.table(prod_cart.slice(0,10))
console.log(prod_cart.length)


let natjoin = prod_cart.filter(f => (f.categoryId == f.idCat))


//console.table(natjoin)

console.log(natjoin.length)



// SUBQUERY

//IN

//clienti che hanno fatto almeno un ordine

/*
SELECT *
FROM clienti
WHERE id IN (
  SELECT customerId FROM ordini
) 
*/
const cli1=clienti.filter(cl=>ordini.filter(oo=>oo.customerId=cl.idCli))
console.table(cli1)

console.log("SUBQUERY IN")

// elenco dei prodotti che sono stati ordinati almeno una volta in quantità superiore a 100 unità

/*
SELECT DISTINCT idProd as id, nome as descr
FROM prodotti 
WHERE productId IN (SELECT productId from DETTAGLI WHERE quantity>100)

*/

let prod=dettagli.map(d=>d.prodotti.flat()).reduce((acc, val) => acc.concat(val), []).filter(v=>v.quantity>100).map(pp=>pp.productId)

let proiezione=prodotti.filter(pp=>prod.includes(pp.idProd)).map(p=>new Object({"id":p.idProd, "descr":p.name}))


//console.table(proiezione)


// elenco dei prodotti che non sono mai stati scontati di almeno il 20%

/*
SELECT DISTINCT idProd as id, nome as descr
FROM prodotti 
WHERE productId NOT IN (SELECT productId from DETTAGLI WHERE discount>=.20)

*/


let prodsco=dettagli.map(d=>d.prodotti.flat()).reduce((acc, val) => acc.concat(val), []).filter(v=>v.discount>0.19).map(pp=>pp.productId*1).sort()

let proiezione_=prodotti.filter(pp=>prodsco.indexOf(pp.idProd)==-1).map(p=>new Object({"id":p.idProd, "descr":p.name}))


//console.table(proiezione_)


// ORDINI IN CUI tutti i prodotti sono di almeno 2 categorie  diverse
/*
SELECT idOrdine, SELECT count(*) DISTINCT categorie from prodotti,categorie) as div
FROM dettagli 
WHERE div >= 2
GROUP BY idOrdine


*/


let rispc={}

prodotti.forEach(pp=>rispc[pp.idProd]=pp.categoryId)


const groupByCat = (dettagli.reduce((gruppi, cc) => {
  var prod=[]
  cc.prodotti.forEach(pp=>prod.push(rispc[pp.productId]))
  let diversi=new Set(prod).size
 
  if(diversi>1) gruppi.push(new Object({"ord":cc.orderId, "det":prod.length, "div":diversi}));
  return gruppi;
}, []))

//console.table(groupByCat)











// JAVASCRIPT MAP REDUCE & SQL



const cars = require("./cars")
const prodotti = require("./prodotti")
const categorie = require("./categorie")
const ordini = require("./ordini")
const dettagli = require("./dettagli")
const clienti = require("./clienti")



//Le operazioni fondamentali su una tabella sono la proiezione e la selezione

//Proiezione
console.log("Proiezione")
//SELECT casa, modello anno FROM CARS

console.log("SELECT casa, modello anno FROM CARS")
let proiez = cars.map(c=>new Object({"casa":c.casa,"modello": c.modello, "anno":c.anno })).slice(0,20);
//console.table(proiez)

//Selezione
console.log("Selezione")
/*SELECT *
 FROM cars
 WHERE dispo<5
*/
console.log("SELECT* FROM cars WHERE dispo < 5")
let selez = cars.filter(cc=>cc.dispo<5)

console.table(selez)

//SORTING
console.log("Sorting")

/*
SELECT * 
FROM CARS 
ORDERBY prezzo
*/
let sorted = cars.sort((a,b)=> ( b.prezzo - a.prezzo)).slice(0,20);
console.log("SELECT * FROM cars ORDERBY prezzo DESC")
//console.table( sorted)

//------------------------------------
// count

//SELECT COUNT(*) FROM CARS

let conta = cars.reduce((count, val) => count + 1, 0);
console.log("SELECT COUNT(*) FROM CARS", conta)

//---------------------------------

// Totale macchine disponibili

//SELECT SUM(dispo) FROM CARS

let totumo = cars.map(cc => cc.dispo)
console.log(totumo)
let totm = cars.map(cc => cc.dispo).reduce((sum, cc) => sum + cc, 0);
//oppure
let totm_alt = cars.reduce((sum, cc) => sum + cc.dispo, 0);

console.log("SELECT SUM(dispo) FROM cars", totm)
console.log("SELECT SUM(dispo) FROM cars", totm_alt)


// --------------------------------------------------

//max-min

//SELECT MAX(prezzo) FROM CARS

const maxPrezzo = cars.map(cc => cc.prezzo).reduce((max, d) => d > max ? d : max);
console.log("SELECT MAX(prezzo) FROM CARS", maxPrezzo)

//SELECT MIN(prezzo) FROM CARS

const minPrezzo = cars.map(cc => cc.prezzo).reduce((min, d) => d < min ? d : min);
console.log("SELECT MIN(prezzo) FROM CARS", minPrezzo)

// Average
//SELECT AVG(prezzo) FROM CARS
const avgPrezzo = cars.map(cc => cc.prezzo).reduce( (r, p) =>{ r.sum += p; ++r.count; return r }, { count: 0, sum: 0 });
console.log("SELECT AVG(prezzo) FROM CARS:", avgPrezzo.sum / avgPrezzo.count)

// TopN
const topN = cars.sort( (a, b) =>  a.prezzo - b.prezzo ).reverse().slice(0, 10)
console.log("SELECT TOP 10(prezzo) FROM cars:")
console.table(topN) 



// Filter 

//GroupBy

//SELECT COUNT(*) FROM CARS GROUP BY(casa)

const groupByModel = cars.reduce((gruppi, cc) => {
  gruppi[cc.casa] = (gruppi[cc.casa] || 0) + 1;
  return gruppi;
}, {})

/* console.log("SELECT casa, COUNT(*) FROM CARS GROUP BY(casa)")*/
console.table(groupByModel) 

// SELECT COUNT(*) FROM CLIENTI GROUP BY(country)

const groupByClientiCountry = clienti.reduce((gruppi, cc) => {

  gruppi[cc.country] = (gruppi[cc.country] || 0) + 1;
  return gruppi;
}, {})



console.table(groupByClientiCountry)

/* 
console.table("oppure")
console.table(Object.entries(groupByClientiCountry)) */
let oo = Object.entries(groupByClientiCountry).map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n)
 console.log("SELECT COUNT(*) FROM CLIENTI GROUP BY(country)")
console.table(oo)/* */

// numero di ordini per cliente

//SELECT count(*), customerId FROM ORDINI GROUP BY customerId HAVING count(*)>=5 ORDER BY count(*) DESC


const OrdinigroupByCliente = Object.entries(ordini.reduce((gruppi, cc) => {

  gruppi[cc.customerId] = (gruppi[cc.customerId] || 0) + 1;
  return gruppi;
}, {})).map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n).filter(o => o.n >= 5)


console.log("SELECT count(*), customerId FROM ORDINI GROUP BY customerId HAVING count(*)>=5 ORDER BY count(*) DESC")
//console.table(OrdinigroupByCliente)

// Distinct


// SELECT DISTINCT casa FROM CARS ORDER BY casa
const distinct = Array.from(new Set(cars.map(cc => cc.casa))).sort()
console.log("DISTINCT casa FROM CARS ORDER BY casa")
//console.log(distinct)

// Binning

// Suddivide i record in base ad un criterio

const categ = cars.reduce((cate, cc) => {

  let pr = parseInt(cc.prezzo)
  if (pr < 20000) cate["piccole"].push(cc)
  else if (pr < 30000) cate["medie"].push(cc)
  else if (pr < 50000) cate["grandi"].push(cc)
  else if (pr < 70000) cate["lusso"].push(cc)
  else cate["extralusso"].push(cc)
  return cate;
}, { piccole: [], medie: [], grandi: [], lusso: [], extralusso: [] })

/* console.log("piccole")
console.table(categ.piccole)

console.log("medie")
console.table(categ.medie)

console.log("grandi")
console.table(categ.grandi)

console.log("lusso")
console.table(categ.lusso)

console.log("extralusso")
console.table(categ.extralusso) */


// Inverted Index

// PER OGNI ANNO FORNIRE L'ELENCO DELLE CASE PRESENTI CON ALMENO UNA VETTURA
const invIndex = cars.reduce((anni, cc) => {
  anni[cc.anno] = (anni[cc.anno] || new Set()).add(cc.casa);
  return anni;
}, {})
//console.log(invIndex)
// PER OGNI CASA FORNIRE L'ELENCO DEGLI ANNI RELATIVI ALLE VETTURE
const invIndex2 = cars.map(cc => new Object({ casa: cc.casa, anno: cc.anno })).reduce((casa, cc) => {
  casa[cc.casa] = (casa[cc.casa] || new Set()).add(cc.anno);
  return casa;
}, {})


//console.log(invIndex2)


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

console.table(groupByCat)










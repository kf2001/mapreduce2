
var cars = require("./cars1")
var prodotti = require("./prodotti")
var categorie = require("./categories")
var ordini = require("./ordini")
var clienti = require("./clienti") 

categorie.map(c=>{c.idCat=c.id;delete c.id;c.descrCat=c.description;delete c.description;c.tipo=c.name; delete c.name })
prodotti.map(p=>{p.idProd=p.id; delete p.id, delete p.discontinued; delete p.supplierId; delete p.quantityPerUnit; delete p.unitsOnOrder; delete p.reorderLevel})



//------------------------------------
// count

//SELECT COUNT(*) FROM CARS

let conta = cars.reduce((count, val) => count + 1, 0);
console.log("SELECT COUNT(*) FROM CARS", conta)

//---------------------------------

// Totale macchine disponibili

//SELECT SUM(dispo) FROM CARS


let totm = cars.map(cc => cc.dispo).reduce((sum, cc) => sum + cc, 0);

console.log("SELECT SUM(dispo) FROM CARS", totm)


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
const avgPrezzo = cars.map(cc => parseInt(cc.prezzo)).reduce(function (r, p) { r.sum += p; ++r.count; return r }, { count: 0, sum: 0 });
console.log("SELECT AVG(prezzo) FROM CARS:", avgPrezzo.sum / avgPrezzo.count)

// TopN
const topN = cars.sort(function (a, b) { return a.prezzo - b.prezzo }).reverse().slice(0, 10)
/* console.log("SELECT TOP 10(prezzo) FROM CARS:")
console.table(topN) */



// Filter 

//GroupBy

//SELECT COUNT(*) FROM CARS GROUP BY(casa)

const groupByModel = cars.reduce((gruppi, cc) => {
  gruppi[cc.casa] = (gruppi[cc.casa] || 0) + 1;
  return gruppi;
}, {})

/* console.log("SELECT COUNT(*) FROM CARS GROUP BY(casa)")
console.table(groupByModel) */

// SELECT COUNT(*) FROM CLIENTI GROUP BY(country)

const groupByClientiCountry = clienti.reduce((gruppi, cc) => {

  gruppi[cc.country] = (gruppi[cc.country] || 0) + 1;
  return gruppi;
}, {})



/* 
console.table(groupByClientiCountry)

console.table("oppure")
console.table(Object.entries(groupByClientiCountry)) */
let oo = Object.entries(groupByClientiCountry).map(kk => new Object({ c: kk[0], n: kk[1] })).sort((a, b) => b.n - a.n)
/* console.log("SELECT COUNT(*) FROM CLIENTI GROUP BY(country)")
console.table(oo) */

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

  let oc = categorie.filter(cc => pp.categoryId == cc.id);
  oc.map(v => {     
    let no={...pp, ...v}    
    loj.push(no) }) 
  return loj;
}, [])

//console.table(left_join)

console.log(left_join.length)



//Right Outer J

/*
SELECT * 
FROM categorie
LEFT JOIN prodotti
ON categorie.id= prodotti.categoryId;
 */
console.log("RIGHT OUTER JOIN")


const right_join = categorie.reduce((roj, cc) => {
  let op = prodotti.filter(pp => pp.categoryId == cc.id);
    
    op.map(v => {     
      let no={...cc, ...v}    
      roj.push(no) }) 
    return roj;
}, [])


//console.table(right_join)

console.log(right_join.length)



// prodotto cartesiano

let a = ['a', 'b', 'c', 'd']
let b = [1, 2, 3]

let f = [].concat(...a.map(p => b.map(b => p + b)))

console.log(f)
//let f =  [].concat(...a.map(a => b.map(b => [a+b]))).reduce((acc, val) => acc.concat(val), []);

console.log("NATURAL JOIN")
// NATURAL JOIN
/*
SELECT * 
FROM prodotti, categorie
WHERE prodotti.categoryId=categorie.id;
 */



//let np = prodotti_.reduce(function (acc, p) { let no = {}; Object.entries(p).forEach(([key, value]) => no[key + "__"] = value); return acc.concat(no) }, [])

let prod_cart = [].concat(...prodotti.map(pp => categorie.map(cc => Object.assign({},{...pp, ...cc}))))

console.table(prod_cart.slice(0,10))
console.log(prod_cart.length)


let natjoin = prod_cart.filter(f => (f.categoryId == f.idCat))


console.table(natjoin)

console.log(natjoin.length)


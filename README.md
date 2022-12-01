// (1) Find all the information about each products

db.products.find({})
   .projection({})
   .sort({_id: 1})
   
// (2) Find the product price which are between 400 to 800

db.products.find({$and : [{product_price: {$gte: 400}}, {product_price: {$lte: 800}}]});

// (3) Find the product price which are not between 400 to 600

db.products.find({$or : [{product_price: {$gte: 600}}, {product_price: {$lte: 400}}]});

// (4) List the four product which are grater than 500 in price 

db.products.find({product_price: {$gte: 500}});

// (5) Find the product name and product material of each products

db.products.find({}, ['product_name', 'product_material']);

// (6) Find the product with a row id of 10

db.products
    .aggregate([
        {$match: {id: '10'}}    
]);

// (7) Find only the product name and product material

db.products.find({}, ['product_name', 'product_material']);

// (8) Find all products which contain the value of soft in product material 

db.products
    .aggregate([
        {$match: {product_material: 'Soft'}}    
]);

// (9) Find products which contain product color indigo and product price 492.00

db.products
    .aggregate([
        {$match: {$or: [{product_color: 'indigo'}, {product_price: 492}] }}    
]);

// (10) Delete the products which product price value are same

var duplicates = [];

db.products.aggregate([
  { $match: { 
    name: { "$ne": '' }  // discard selection criteria
  }},
  { $group: { 
    product_price: { name: "$name"}, // can be grouped on multiple properties 
    dups: { "$addToSet": "$product_price" }, 
    count: { "$sum": 1 } 
  }},
  { $match: { 
    count: { "$gt": 1 }    // Duplicates considered as count greater than one
  }}
],
{allowDiskUse: true}       // For faster processing if set is larger
)               // You can display result until this and check duplicates 
.forEach(function(doc) {
    doc.dups.shift();      // First element skipped for deleting
    doc.dups.forEach( function(dupId){ 
        duplicates.push(dupId);   // Getting all duplicate ids
        }
    )
})

printjson(duplicates);     

// Remove all duplicates in one go    
db.products.remove({product_price:{$in:duplicates}})  

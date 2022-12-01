db.products.find();

db.products.find({$or : [{product_price: {$gte: 400}}, {product_price: {$lte: 800}}]});

db.products.find({product_price: {$gte: 500}});

db.products.find({}, ['product_name', 'product_material']);

db.products
    .aggregate([
        {$match: {$or: [{product_color: 'indigo'}, {product_price: 492}] }}    
]);


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
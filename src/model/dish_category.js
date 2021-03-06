/*
-Id
-Name
 */
var mongoose=require('mongoose');
var url =require('url');
var db=require('../db/db');
var dish_catSchem=mongoose.Schema({
    Id:{
        type:Number,
        unique:true,
        required:true
    },
    Name:{
        type:String,
        unique:true,
        required:true
    }
});
var bind = function(app){
   // fill categories
   db.collection('dish_cats').drop();
    var catArray = [{
        'Id': 1,
        'Name': 'Супы'
    },{
        'Id': 2,
        'Name': 'Салаты'
    },{
        'Id': 3,
        'Name': 'Горячее'
    },{
        'Id': 4,
        'Name': 'Закуски'
    },{
        'Id': 5,
        'Name': 'Напитки'
    }];
   function addCategory(index) {
       db.collection('dish_cats').insertOne(catArray[index], function () {
           if (index < catArray.length - 1) {
               addCategory(index + 1);
           }
       });
   }
   addCategory(0);

    app.post('/dish_cats/store', function(req, res) {
            req.body.Id = parseInt(req.body.Id || '0', 10);
            var dish_catId = req.body.Id;
            var dish_cat = db.model('dish_cats', dish_catSchem);
            var create = function(){
                var dish_catPostedElem = new dish_cat(req.body);
                dish_catPostedElem.save();
            };
            if (dish_catId) {
                db.collection('dish_cats').remove({Id: parseInt(dish_catId, 10)});
                create();
                res.end('OK');
            }
            else {
                db.getNextSequence('dish_catid', function(id){
                    req.body.Id = id;
                    create();
                    res.end('OK');
                })
            }

        })
        .get('/dish_cats/list', function(req, res){
            db.collection('dish_cats').find().toArray().then(function(data){
                res.json(data.sort(function(a, b) {
                    return a.Id > b.Id;
                }));
            });

        });
};
module.exports =bind;
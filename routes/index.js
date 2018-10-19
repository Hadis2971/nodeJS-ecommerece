const express    = require("express"),
      Product    = require("../models/Product"),
      User       = require("../models/User"),
      Order      = require("../models/Order"),
      isLoggedIn = require("../helpers/isLoggedIn"),  
      router     = express.Router();




router.get("/allProducts", isLoggedIn, (req, res) => {
    Product.find({}, (err, products) => {
        if(err) throw err;
        else{
            res.render("ecommerce/allProducts", {products: products});
        }
    });
});

router.get("/pcGames", isLoggedIn, (req, res) => {
    Product.find({platform: "PC"}, (err, products) => {
        if(err) throw err;
        else{
            res.render("ecommerce/pcGames", {products: products}); 
        }
    });
});

router.get("/ps4Games", isLoggedIn, (req, res) => {
    Product.find({platform: "Ps4"}, (err, products) => {
        if(err) throw err;
        else{
            res.render("ecommerce/pcGames", {products: products}); 
        }
    });
});

router.get("/myOrder", isLoggedIn, (req, res) => {
    Order.find({userID: req.user._id}, (err, order) => {
        if(err) throw err;
        else{
            if(!order.length){
                res.render("ecommerce/myOrder");
            }else{
                const userOrder = {
                    user: order[0].user,
                    order: order[0].order
                }
                res.render("ecommerce/myOrder", {userOrder: userOrder});
            }
        }
    });
});

router.post("/myOrder", isLoggedIn, (req, res) => {
    if(req.body === {}){
        req.flash("info_msg", "You Have Made an Order");
        res.redirect("/allProducts");
    }else{
        const newOrder = new Order({
            userID: req.user._id,
            user: {
                name: req.user.name,
                email: req.user.email
            },
            order: req.body
        });
        newOrder.save((err, order) => {
            if(err) throw err;
            else{
                console.log(newOrder);
                req.flash("success_msg", "You Have Made an Order");
                res.redirect("/myOrder");
            }
        });
    }
});

router.get("/", isLoggedIn, (req, res) => {
    res.render("ecommerce/index");
});

router.get("/:id", isLoggedIn, (req, res) => {
    User.findOne({_id: req.params.id}, (err, user) => {
        res.render("ecommerce/index", {user: user});
    });
});



module.exports = router;

const axios = require("axios");
const express = require("express");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const router = express.Router();
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

router.use(express.json());
router.use(express.urlencoded({extended: true}));

const isNotEmpty = function (obj) {

    return Object.keys(obj).length > 0

}

const search = function(query, page, callback) {

    axios.get(`https://uogguafak.omeka.net/api/items?search=${query}&page=${page}&per_page=10`, 
    {headers: {Accept: "application/json", "Accept-Encoding": "identity"}}).then((data) => {

       return callback(data);
       
    }).catch((e) => {

        console.log(e);
        return callback(null);

    });

}

const fetch = function(query, callback) {

    axios.get(query, {headers: {Accept: "application/json", "Accept-Encoding": "identity"}}).then((data) => {

        return callback(data.data);

    }).catch((e) => {

        console.log(e);
        return callback(null);

    })

}


const fetchItem = function(req, res, next) {

    const id = DOMPurify.sanitize(req.params.id);
    const query = `https://uogguafak.omeka.net/api/items/${id}`
    const photoQuery = `https://uogguafak.omeka.net/api/files?item=${id}`
    
    fetch(query, (data) => {

        if (data) {

            console.log("Data", data);

            fetch (photoQuery, (photoData) => {

                if (photoData) {

                    res.render("entry", {data: data, photoData: photoData});
                }

                else {

                    res.render("entry", {data: data, photoData: ""})

                }

            })
            

        } else {

            next();

        }

    })


}

const fetchCollection = function(req, res, next) {

    const id = DOMPurify.sanitize(req.params.id);
    const query = `https://uogguafak.omeka.net/api/collections/${id}`
    // const photoQuery = `https://uogguafak.omeka.net/api/files?item=${id}`

    fetch(query, (data) => {

        res.render("entryCollections", {data: data})

    })

};

const fetchExhibit = function(req, res, next) {

    const id = DOMPurify.sanitize(req.params.id);
    const query = `https://uogguafak.omeka.net/api/exhibits/${id}`;

    fetch(query, (data) => {

        res.render("entryExhibits", {data: data});

    })

}

const checkParams = function(req, res, next) {

    const searchQuery = req.query.search;
    const page = req.query.page;

    if (isNotEmpty(req.query)) {

        if (req.query.search) {

            search(searchQuery, page, function(response) {

                let results = [];

    
                for (i in response.data) {
                        
                    if (response.data[i]["element_texts"][0].text === undefined) {

                        continue;

                    } else {

                        const entry = {id: response.data[i].id, 
                                file: response.data[i].files.url,
                                url: response.data[i].url, 
                                title: response.data[i]["element_texts"][0].text};
                                
                        results.push(entry);
                        
                    }
    
                }

                console.log(results.length);
                res.status(200).render("search", {searchQuery: searchQuery, message: results, paramsExist: true, pageNumber: Number(req.query.page) || ""});

            })
            

        } else {

            res.status(200).render("search", {searchQuery: "", message: "Please make sure to enter a search.", paramsExist: true, pageNumber: ""})

        }


    } else {

        next();

    }


} 


router.get("/search", checkParams, function(req, res) {

    res.status(200).render("search", {searchQuery: "", message: "", paramsExist: false, pageNumber: undefined});

});

router.get("/items", function(req, res) {

    if (req.query.page) {

        fetch(`https://uogguafak.omeka.net/api/items?page=${req.query.page}&per_page=10`, function(data) {
        
        res.status(200).render("items", {message: data, type: "Items", pageNumber: Number(req.query.page)})

        });

    } else {

        fetch("https://uogguafak.omeka.net/api/items?page=1&per_page=10", function(data) {
        
        res.status(200).render("items", {message: data, type: "Items", pageNumber: Number(1)})

        });

    }


})

router.get("/collections", function(req, res) {

    if (req.query.page) {

    fetch(`https://uogguafak.omeka.net/api/collections?page=${req.query.page}&per_page=10`, function(data) {
        
        res.status(200).render("collections", {message: data, type: "Collections", pageNumber: Number(req.query.page)})

    })

    } else {

        fetch('https://uogguafak.omeka.net/api/collections?page=1&per_page=10', function(data) {
        
        res.status(200).render("collections", {message: data, type: "Collections", pageNumber: Number(1)})

    })


    }



});

router.get("/exhibits", function(req, res) {

    if (req.query.page) {

        fetch(`https://uogguafak.omeka.net/api/exhibits?page=${req.query.page}&per_page=10`, function(data) {

            res.status(200).render("exhibits", {message: data, type: "Exhibits", pageNumber: Number(req.query.page)});

        })

    } else {

        fetch('https://uogguafak.omeka.net/api/exhibits?page=1&per_page=10', function(data) {

            console.log(data);
            res.status(200).render("exhibits", {message: data, type: "Exhibits", pageNumber: Number(1)});

        })

    }

})

router.get("/entry/items/:id", fetchItem, function(req, res) {

    res.status(400).send("Fail")

});

router.get("/entry/collections/:id", fetchCollection, function(req, res) {

    res.status(400).send("Fail");

});

router.get("/entry/exhibits/:id", fetchExhibit, function(req, res) {

    res.status(400).send("Fail");

});

router.get("/about", function(req, res) {

    res.render("aboutUs");

})

router.post("/search", function(req, res) {

    const search = DOMPurify.sanitize(req.body.search);

    console.log(search);


    res.redirect(`/search?search=${search}&page=1`);


});

module.exports = router;
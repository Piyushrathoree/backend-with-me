const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const urlencoded = require('body-parser').urlencoded;


app.use(express.json());
app.set("view engine", "ejs");  
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    fs.readdir(path.join(__dirname, 'files-ejs'), (err, files) => {
        res.render("index", { files: files });
    });
});

app.get('/files-ejs/:filename', (req, res) => {
    let filename=decodeURIComponent( req.params.filename);
    fs.readFile(path.join(__dirname,"files-ejs",filename), 'utf-8', (err, filedata) => {
        res.render('readmore.ejs', { filename:filename, filedata: filedata });
    });
});
app.post('/create', (req, res) => {
    let title=decodeURIComponent(req.body.title);
    fs.writeFile(path.join(__dirname,"files-ejs",title+".txt"), req.body.details, (err) => {
        res.redirect("/");
    });
});
app.get('/edit/:filename',(req, res) => {
    res.render("edit",{filename:req.params.filename})
})

app.post('/edit', (req, res) => {
   fs.rename(`./files-ejs/${req.body.prev}`,`./files-ejs/${req.body.new}`,(err)=>{
    res.redirect("/")
   }) 
})


app.get('/edit/:filename', (req, res) => {
    let filename = decodeURIComponent(req.params.filename);
    res.render("edit", { filename: filename });
});

app.post('/edit/:filename', (req, res) => {
    let filename = req.params.filename;
    fs.unlink(path.join(__dirname, "files-ejs", filename), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error deleting file");
        } else {
            res.redirect("/");
        }
    });
});
app.listen(3001);
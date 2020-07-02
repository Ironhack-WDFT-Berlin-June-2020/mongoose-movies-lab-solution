const express = require('express');
const router = express.Router();
const Celebrity = require('../models/celebrity');
const Movie = require('../models/movie');

router.get('/', (req, res) => {
    Movie.find().populate('cast').then(movies => {
        res.render('movies/index', { movies });
    })
        .catch(err => {
            next(err);
        });
});

router.get('/new', (req, res) => {
    Celebrity.find().then(celebrities => {
        res.render('movies/new', { celebrities });
    })
        .catch(err => {
            next(err);
        });
});

router.post('/', (req, res) => {
    const { title, genre, plot, cast } = req.body;
    Movie.create({ title, genre, plot, cast }).then(() => {
        res.redirect('/movies')
    })
        .catch(err => {
            next(err);
        });
});

router.get('/:id/edit', (req, res, next) => {
    Movie.findById(req.params.id).populate('cast')
        .then(movie => {
            console.log(movie);
            Celebrity.find().then(celebrities => {
                let options = '';
                let selected = '';
                // console.log(movies.cast);
                celebrities.forEach(actor => {
                    // if (movie.cast.map(el => el._id).includes(actor._id)) {
                    //     selected = 'selected';
                    // } else {
                    //     selected = '';
                    // }
                    selected = movie.cast.map(el => el._id).includes(actor._id) ? ' selected' : '';
                    options += `<option value="${actor._id}" ${selected}>${actor.name}</option>`
                });
                console.log(options);
                // res.render('movies/edit', { movie, celebrities });
                res.render('movies/edit', { movie, options });
            })
        })
        .catch(err => {
            next(err);
        })
});

router.post('/:id/', (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, { title, genre, plot })
        .then(() => {
            res.redirect('/movies');
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;
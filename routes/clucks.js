const path = require('path');
const express = require('express');
const router = express.Router();
//const knex = require('../db');
const multer = require('multer');

const UPLOADS_DIR = 'uploads';
const upload = multer({ dest: path.join(__dirname, '..', 'public', UPLOADS_DIR) });

router.get('/new', (req, res) => {
    res.render('clucks/new');

    router.get('/login', (req, res) => {
        res.render('login');
    });

    // equivalence of one day!
    const ONE_DAY = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

    router.post('/login', (req, res) => {
        const { username } = req.body;
        res.cookie('username', username, { expires: ONE_DAY })
        res.redirect('/clucks');
    })

    router.post('/sign_in', (req, res) => {
        const username = req.body.username;
        res.cookie("username", username, { maxAge: ONE_DAY });
        res.redirect("/clucks");
    });
    router.post('/sign_out', (req, res) => {
        res.clearCookie("username");
        res.redirect("/login");
    });


});

router.post('/', upload.single('picture'), (req, res) => {
    const username = req.body.username || 'username';
    const content = req.body.content || '';
    const time_dateTime = new Date();
    const topics_arr = content.split(' ').filter(x => x[0] === '#');

    let image_url = ''
    if (req.file) {
        const filename = req.file.filename;
        image_url = `/${path.join(UPLOADS_DIR, filename)}`
    }

    knex
        .insert({ username, content, image_url, time_dateTime })
        .into('clucks')
        .then(result => {


            return knex('trending_topics')
                .increment('count', 1)
                .whereIn('topic', topics_arr)
                .returning('topic')
                .then(result => {
                    let newTopics = topics_arr
                        .filter(x => (result.indexOf(x) === -1))
                        .map((x) => ({ topic: x }));
                    return knex('trending_topics')
                        .insert(newTopics)
                        .into('trending_topics')
                        .then(result => {
                            res.redirect(`/clucks`);
                        })
                })
        })
        .catch(err => res.send(err));
});

router.get('/', (req, res) => {
    function timeSince(date) {
        let seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) {
            return `Just now`;
        } else {
            let interval = Math.floor(seconds / 31536000);
            if (interval > 1) {
                return interval + " years";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " months";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " days";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " hours";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " minutes";
            }
            return Math.floor(seconds) + " Just Now";
        }
    }

    function trendingTopics(arg) {
        let arr = [];
        let y = arg.map(x => {
            let a = x.content;
            let b = a.split(' ');
            let c = b.filter(x => (x[0] === '#'));
            c.map(d => arr.push(d));
        });
        let obj = {};
        for (let i = 0, j = arr.length; i < j; i++) {
            obj[arr[i]] = (obj[arr[i]] || 0) + 1;
        }
        return obj;
    }

    knex
        .select()
        .from('clucks')
        .orderBy('created_at', 'DESC')
        .then(clucks => {
            knex
                .select()
                .from('trending_topics')
                .orderBy('count', 'DESC')
                .limit(10)
                .then(topics => {
                    res.render('clucks/index', { topics, clucks, timeSince });
                })
                .catch(err => res.send(err));
        })
        .catch(err => res.send(err));

});


module.exports = router;
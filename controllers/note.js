var express = require('express');
var mongoose = require('mongoose');
var note = express.Router();
var Note = mongoose.model('Note');

note.get('/:id', function(req, res) {
    if (req.params.id && req.params.id.length === 24) {
        Note.getNote(req.params.id, function(err, result) {
            res.json({
                note: result
            });
        });
    } else {
        res.json({
            note: null
        });
    }
});

note.post('/:id', function(req, res) {
    if (req.params.id && req.params.id.length === 24
        && req.body.text && req.body.text.length <= 65536) {
        Note.updateNote(req.params.id, req.body.text || '', function(err, result) {
            res.json({
                note: result
            });
        });
    } else {
        res.json({
            note: null
        });
    }
});

note.post('/readonly/:id', function(req, res) {
    if (req.params.id && req.params.id.length === 24) {
        Note.setReadonly(req.params.id, function(err, result) {
            res.json({
                note: result
            });
        });
    } else {
        res.json({
            note: null
        });
    }
});

module.exports = note;

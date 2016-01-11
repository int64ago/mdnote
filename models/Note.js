var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    create: Date,
    lastVisit: Date,
    lastUpdate: Date,
    password: {
        type: String,
        default: ''
    },
    markdown: {
        type: Boolean,
        default: false
    },
    readonly: {
        type: Boolean,
        default: false
    },
    visitCount: {
        type: Number,
        default: 0
    },
    text: {
        type: String,
        default: ''
    }
}, {
    versionKey: false
});

noteSchema.statics = {
    newNote: function(callback) {
        var note = this({
            create: new Date(),
            lastVisit: new Date(),
            lastUpdate: new Date()
        });
        note.save(callback);
    },
    getNote: function(id, callback) {
        this.update({
            _id: id
        }, {
            $inc: {
                visitCount: 1
            },
            $set: {
                lastVisit: new Date()
            }
        }).exec();
        this.findOne({
            _id: id
        }).exec(callback);
    },
    updateNote: function(id, text, callback) {
        var self = this;
        self.update({
            _id: id,
            readonly: false
        }, {
            $set: {
                lastUpdate: new Date(),
                text: text
            }
        }).exec(function(err, result) {
            self.findOne({
                _id: id
            }).exec(callback);
        });
    },
    setReadonly: function(id, callback) {
        var self = this;
        self.update({
            _id: id
        }, {
            $set: {
                readonly: true
            }
        }).exec(function(err, result) {
            self.findOne({
                _id: id
            }).exec(callback);
        });
    },
    setMarkdown: function(id, status, callback) {
        var self = this;
        self.update({
            _id: id
        }, {
            $set: {
                markdown: status
            }
        }).exec(function(err, result) {
            self.findOne({
                _id: id
            }).exec(callback);
        });
    }
};

mongoose.model('Note', noteSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const FriendsOfFriends = require('friends-of-friends');

var options = {
    personModelName: 'User',
    friendshipModelName: 'Friend_Relationships',
    friendshipCollectionName: 'Friendships'
}

var fof = new FriendsOfFriends(mongoose, options);

const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    }
});

User.plugin(passportLocalMongoose);
User.plugin(fof.plugin, options);

module.exports = mongoose.model('User', User);
/**
 * Used to insert initial data given from Gerardo
 * Not used any other time!
 */

const db = require('./db');

const friends = require('../../initData/friends.json');
const publications = require('../../initData/publications');

db.Friend.insertMany(friends);
db.Publication.insertMany(publications);
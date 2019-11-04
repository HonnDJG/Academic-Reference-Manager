/**
 * Used to insert initial data given from Gerardo
 * Not used any other time!
 */


const context = require('../IoC/context').newContext();
const friends = require('../../initData/friends.json');
const publications = require('../../initData/publications.json');
const reviews = require('../../initData/reviews.json');

const run = async (context) => {

    const db = context('db')(context);
    const ObjectId = context('mongoose').Types.ObjectId;

    const publicationsWithOID = publications.map(p => ({
        _id: new ObjectId(),
        ...p
    }));

    const friendsWithOID = friends.map(f => ({
        _id: new ObjectId(),
        ...f
    }))

    // get loans (publications) from Users.json and create new array of loans connecting the two.
    const loans = friendsWithOID.filter(f => f.publications ? f.publications : null)
        .map(f => {
            return f.publications.map(p => {
                const { id, ...l } = p
                return {
                    user: f._id,
                    publication: publicationsWithOID.find(o => id == o.id)._id,
                    ...l
                }
            })
        }).flat();

    // generate reviews from ratings.json for seeding and testing
    const mappedReviews = reviews.map(r => {
        return {
            user: friendsWithOID.find(o => r.user == o.id)._id,
            publication: publicationsWithOID.find(o => r.publication == o.id)._id,
            rating: r.rating
        }
    });

    // clear and insert new data into database.
    try {
        await db.Publication.deleteMany();
        await db.Publication.insertMany(publicationsWithOID);

        await db.User.deleteMany();
        await db.User.insertMany(friendsWithOID);

        await db.Loan.deleteMany();
        await db.Loan.insertMany(loans);

        await db.Review.deleteMany();
        await db.Review.insertMany(mappedReviews);
    } catch (e) {
        console.log(e);
    }

    console.log("Done!");

    return process.exit(0);
};

run(context);
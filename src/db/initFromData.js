/**
 * Used to insert initial data given from Gerardo
 * Not used any other time!
 */


const context = require('../IoC/context').newContext();
const friends = require('../../initData/friends.json');
const publications = require('../../initData/publications.json');

const run = async (context) => {

    const db = context('db')(context);
    const ObjectId = context('mongoose').Types.ObjectId;

    const publicationsWithOID = publications.map(p => ({
        _id: new ObjectId(),
        ...p
    }));

    const parsedFriends = friends.map(f => {
        const friends = {
            _id: new ObjectId(),
            ...f,
            publications: (f.publications && f.publications.map(p => {
                const publication = {
                    publication: publicationsWithOID.find((o) => p.id == o.id)._id,
                    ...p
                }
                const { id, ...noId } = publication;
                return noId
            }
            )) || []
        }

        const { id, ...friendWithoutId } = friends;
        return friendWithoutId;
    });

    const parsedPublications = publicationsWithOID.map(p => {
        const { id, ...withoutId } = p;
        return withoutId;
    });

    try {
        await db.Publication.deleteMany();
        await db.Publication.insertMany(parsedPublications);

        await db.User.deleteMany();
        await db.User.insertMany(parsedFriends);
    } catch (e) {
        console.log(e);
    }

    console.log("Done!");

    return process.exit(0);
};

await run(context);
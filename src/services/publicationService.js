module.exports = (context) => {
    const db = context('db')(context);

    return {
        getAllPublications: async ( cb, errorCb) => {
            try{
                const publications = await db.Publication.find({});
                return cb(publications);
            } catch(e) {
                return errorCb(500, e);
            }
            
        }   
    }

}
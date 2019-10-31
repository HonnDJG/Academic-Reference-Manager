module.exports = (context) => {
    const db = context('db')(context);

    return {
        getAllPublications: async ( cb, errorCb) => {
            try{
                const publications = await db.Publication.getAllPublications();
                return cb(publications);
            } catch(e) {
                return errorCb(500, e);
            }
            
        },
        createPublication: async ( body, cb, errorCb) => {
            const publication = body;
            console.log(publication);
            try{
                const result = await cb.Publication.createPublication(publication);
                return cb(result);
            }catch(e){
                // vantar kannski viðeigandi status code, setti þennan bara sem placeholder
                return errorCb(500, e);
            }
        },
        getPublicationById: async (req, cb, errorCb) => {
            const id = req.params.publication_id;
            try{
                const publication = await db.Publication.getPublicationById(id);
                return cb(publication);
            }catch(e) {
                return errorCb(500, e);
            }
        }   
    }

}
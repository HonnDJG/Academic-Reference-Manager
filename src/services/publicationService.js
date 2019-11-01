module.exports = (context) => {
    const db = context('db')(context);
    const boom = context('boom');

    return {
        getAllPublications: async () => {
            try {
                const publications = await db.Publication.getAllPublications();
                return publications;
            } catch (e) {
                throw boom.badImplementation();
            }

        },
        createPublication: async (publication, cb, errorCb) => {
            try {
                const result = await db.Publication.createPublication(publication);
                return cb(result);
            } catch (e) {
                return errorCb(500, e);
            }
        },
        getPublicationById: async (id, cb, errorCb) => {
            try {
                const publication = await db.Publication.getPublicationById(id);
                return cb(publication);
            } catch (e) {
                return errorCb(500, e);
            }
        },
        removePublicationById: async (id, cb, errorCb) => {
            try {
                const publication = await db.Publication.removePublicationById(id);
                return cb(publication);
            } catch (e) {
                return errorCb(500, e);
            }
        },
        updatePublicationById: async (id, body, cb, errorCb) => {
            try {
                const publication = await db.Publication.updatePublicationById(id, body);
                return cb(publication);
            } catch (e) {
                return errorCb(500, e);
            }
        },
        getAllReviews: async (cb, errorCb) => {
            try {
                const reviews = await db.Publication.getAllReviews();
                return cb(reviews);
            } catch (e) {
                return errorCb(500, e);
            }
        },
        getReviewsByPublicationId: async (id, cb, errorCb) => {
            try {
                const reviews = await db.Publication.getReviewsByPublicationId(id);
                return cb(reviews);
            } catch (e) {
                return errorCb(500, e);
            }

        },
        getReviewByPublicationAndUserId: async (publicationId, userId, cb, errorCb) => {
            try {
                const review = await db.Publication.getReviewByPublicationAndUserId(publicationId, userId);
                return cb(review);
            } catch (e) {
                return errorCb(500, e);
            }

        },
        updateUserReview: async (publicationId, userId, review, cb, errorCb) => {
            try {
                const result = await db.Publication.updateUserReview(publicationId, userId, review);
                return cb(result);
            } catch (e) {
                return errorCb(500, e);
            }

        },
        removeUserReview: async (publicationId, userId, cb, errorCb) => {
            try {
                const result = await db.Publication.removeUserReview(publicationId, userId);
                return cb(result);
            } catch (e) {
                return errorCb(500, e);
            }

        }


    }

}
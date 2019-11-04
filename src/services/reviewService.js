module.exports = (context) => {
    const db = context('db')(context);
    const boom = context('boom');
    const throwCreator = context('throwCreator')(context);


    return {
        getAllReviews: async () => {
            try {
                const reviews = await db.Review.getAllReviews();
                return reviews;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        },
        getReviewsByPublicationId: async (p_id) => {
            try {
                await db.Publication.checkExistence(p_id);
                const reviews = await db.Review.getReviewsByPublicationId(p_id);
                return reviews;
            } catch (e) {
                throwCreator.createThrow(e);
            }

        },
        getReviewsByPublicationAndUserId: async (p_id, u_id) => {
            try {
                await db.Publication.checkExistence(p_id);
                await db.User.checkExistence(u_id);
                const review = await db.Review.getReviewByPublicationAndUserId(p_id, u_id);
                return review;
            } catch (e) {
                console.log(e);
                throwCreator.createThrow(e);
            }

        },
        createUserReview: async (p_id, u_id, body) => {
            try {
                await db.Publication.checkExistence(p_id);
                await db.User.checkExistence(u_id);

                const existingReview = await db.Review.getReviewByPublicationAndUserId(p_id, u_id);
                if (existingReview) { throw boom.conflict("User has already reviewed this publication!"); }

                const hasBorrowed = await db.Loan.getLoanByPublicationAndUserId(p_id, u_id);
                if (!hasBorrowed) { throw boom.badRequest("User must have borrowed this publication!"); }

                const reviewBody = { publication: p_id, user: u_id, ...body }

                const review = await db.Review.createUserReview(reviewBody);
                return review;

            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        removeUserReview: async (p_id, u_id) => {
            try {
                await db.Publication.checkExistence(p_id);
                await db.User.checkExistence(u_id);

                const existingReview = await db.Review.getReviewByPublicationAndUserId(p_id, u_id);
                if (!existingReview) { throw boom.conflict("User has not reviewed this publication!"); }

                await db.Review.removeUserReview(p_id, u_id);

                return "Review removed successfully";

            } catch (e) {
                throwCreator.createThrow(e);
            }
        },

        updateUserReview: async (p_id, u_id, body) => {
            try {
                await db.Publication.checkExistence(p_id);
                await db.User.checkExistence(u_id);

                const existingReview = await db.Review.getReviewByPublicationAndUserId(p_id, u_id);
                if (!existingReview) { throw boom.conflict("User has not reviewed this publication!"); }

                const result = await db.Review.updateUserReview(p_id, u_id, body);
                return result;
            } catch (e) {
                throwCreator.createThrow(e);
            }

        },
        getReviewsByUserId: async (u_id) => {
            try {
                await db.User.checkExistence(u_id);
                const reviews = await db.Review.getReviewsByUserId(u_id);
                return reviews;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        }
    }
}
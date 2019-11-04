module.exports = (context) => {
    const db = context('db')(context);
    const boom = context('boom');
    const throwCreator = context('throwCreator')(context);

    return {
        // returns reccomendations for a given user.
        getRecommendationByUserId: async (u_id) => {
            try {
                const userLoanedPublications = await db.Loan.getLoansByUserId(u_id).select('publication -_id');
                const userLoanedPublicationsIdArr = userLoanedPublications.map(x => x.publication);
                const recommendations = await db.Review.getRecommendationExcludingBorrowed(userLoanedPublicationsIdArr);
                if (!recommendations.length) { throw boom.notFound("We have no specific recommendations for you! This is because we have not yet gotten any reviews from anybody."); }
                return recommendations;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        }
    }

};
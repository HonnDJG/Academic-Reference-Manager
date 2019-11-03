module.exports = (context) => {
    const db = context('db')(context);
    const boom = context('boom');
    const throwCreator = context('throwCreator')(context);

    return {
        getRecommendationByUserId: async (u_id) => {
            try {
                const userLoanedPublications = await db.Loan.getLoansByUserId(u_id).select('publication -_id');
                const userLoanedPublicationsIdArr = userLoanedPublications.map(x => x.publication);
                const recommendations = await db.Review.getRecommendationExcludingBorrowed(userLoanedPublicationsIdArr);
                if (!recommendations.length) { return "We have to specific recommendations for you! This is because we have not yet gotten any reviews from anybody."; }
                return recommendations;
            } catch (e) {
                throwCreator.createThrow(e);
            }
        }
    }

};
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
                return recommendations;
            } catch (e) {
                console.log(e);
            }
        }
    }

};
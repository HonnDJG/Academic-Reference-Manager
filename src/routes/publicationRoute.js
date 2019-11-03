module.exports = (context) => {
    const express = context("express");
    const router = express.Router();
    const publicationService = context('publicationService')(context);
    const reviewService = context('reviewService')(context);
    const permit = context('permission');

    /// GET
    router.get("/", async (req, res) => {
        const { query } = req;
        const { loanDate, loanDuration } = query;
        try {
            let publications;
            if (loanDate && loanDuration) {
                publications = await publicationService.getPublicationsOnLoanByDateAndDuration(query);
            } else if (loanDate) {
                publications = await publicationService.getPublicationsOnLoanByDate(query);
            } else if (loanDuration) {
                publications = await publicationService.getPublicationsOnLoanByDuration(query);
            } else {
                publications = await publicationService.getAllPublications(query);
            }
            res.send(publications);
        } catch (e) {
            console.log(e);
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.get("/reviews", async (req, res) => {
        try {
            const reviews = await reviewService.getAllReviews();
            res.send(reviews);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.get("/:p_id/reviews", async (req, res) => {
        const { p_id } = req.params;
        try {
            const reviews = await reviewService.getReviewsByPublicationId(p_id);
            res.send(reviews);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.get("/:p_id", async (req, res) => {
        const { p_id } = req.params;
        try {
            const reviews = await publicationService.getPublicationById(p_id);
            res.send(reviews);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.get("/:p_id/reviews/:u_id", async (req, res) => {
        const { p_id, u_id } = req.params;
        try {
            const reviews = await reviewService.getReviewsByPublicationAndUserId(p_id, u_id);
            res.send(reviews);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    /// POST

    router.post("/", async (req, res) => {
        try {
            const result = await publicationService.createPublication(req.body);
            res.send(result);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    /// DELETE

    router.delete("/:p_id", async (req, res) => {
        const { p_id } = req.params;
        try {
            const deleted = await publicationService.removePublicationById(p_id);
            res.send("Successfully deleted!");
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    /// UPDATE

    router.put("/:p_id", async (req, res) => {
        const { p_id } = req.params;
        try {
            const result = await publicationService.updatePublicationById(p_id, req.body);
            res.send(result)
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });



    router.put("/:p_id/reviews/:u_id", async (req, res) => {
        const { p_id, u_id } = req.params;
        try {
            const review = req.body;
            const result = await reviewService.updateUserReview(p_id, u_id, review);
            res.send(result);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.delete("/:p_id/reviews/:u_id", async (req, res) => {
        const { p_id, u_id } = req.params;
        try {
            const deleted = await reviewService.removeUserReview(p_id, u_id);
            res.send(deleted);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });


    return router;

}
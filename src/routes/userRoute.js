module.exports = (context) => {
    const express = context("express");
    const router = express.Router();
    const userService = context('userService')(context);
    const publicationService = context('publicationService')(context);
    const reviewService = context('reviewService')(context);
    const recommendationService = context('recommendationService')(context);
    const permit = context('permission');


    /// Users related information

    // returns a list of all users if there are no
    // query parameters, else it returns a report
    // depending on which query parameters are set.
    router.get("/", permit("admin"), async (req, res) => {
        const { query } = req;
        const { loanDate, loanDuration } = query;
        try {
            let users;
            if (loanDate && loanDuration) {
                users = await userService.getUsersByDateAndDuration(query);
            } else if (loanDate) {
                users = await userService.getUsersOnLoanByDate(query);
            } else if (loanDuration) {
                users = await userService.getUsersByDuration(query);
            } else {
                users = await userService.getAllUsers(query);
            }
            res.send(users);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // creates a new user.
    // admin role required.
    router.post("/", permit("admin"), async (req, res) => {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // returns a user with id = u_id.
    // admin role required
    router.get("/:u_id", permit("admin"), async (req, res) => {
        const { u_id } = req.params;
        try {
            const user = await userService.getUserById(u_id);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // deletes a user with id = u_id.
    // admin role required.
    router.delete("/:u_id", permit("admin"), async (req, res) => {
        const { u_id } = req.params;
        try {
            const user = await userService.deleteUser(u_id);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // updates a user with id = u_id.
    // admin role required.
    router.put("/:u_id", permit("admin"), async (req, res) => {
        const { u_id } = req.params;
        try {
            const user = await userService.updateUser(u_id, req.body);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });


    /// publications related information

    // returns a list of publications on loan by user with id = u_id.
    // auth or admin role required.
    router.get("/:u_id/publications", permit("auth", "admin"), async (req, res) => {
        const { u_id } = req.params;
        try {
            const publications = await publicationService.getPublicationsOnLoanByUserId(u_id);
            res.send(publications);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // loans a publication with id = p_id to user with id = u_id.
    // auth or admin role required.
    router.post("/:u_id/publications/:p_id", permit("auth", "admin"), async (req, res) => {
        try {
            const loan = await publicationService.loanPublication(req.params.u_id, req.params.p_id, req.body);
            res.status(201).send(loan)
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // returns a publication with id = p_id that was on loan to user with id = u_id.
    // auth or admin role required.
    router.delete("/:u_id/publications/:p_id", permit("auth", "admin"), async (req, res) => {
        try {
            const loan = await publicationService.returnPublication(req.params.u_id, req.params.p_id);
            res.send(loan);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // updates loan information for loan of publication with id = p_id to user with id = u_id.
    // admin role required.
    router.put("/:u_id/publications/:p_id", permit("admin"), async (req, res) => {
        try {
            const loan = await publicationService.updateLoan(req.params.u_id, req.params.p_id, req.body);
            res.send(loan)
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });


    /// Reviews related information
    
    // returns user reviews by user with id = u_id.
    // auth or admin role required.
    router.get("/:u_id/reviews", permit("auth", "admin"), async (req, res) => {
        try {
            const reviews = await reviewService.getReviewsByUserId(req.params.u_id);
            res.send(reviews);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // returns a review for publication with id = p_id by user with id = u_id.
    // auth or admin role requied.
    router.get("/:u_id/reviews/:p_id", permit("auth", "admin"), async (req, res) => {
        const { u_id, p_id } = req.params;
        try {
            const reviews = await reviewService.getReviewsByPublicationAndUserId(p_id, u_id);
            res.send(reviews);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // creates new user review by user with id = u_id , for publication with id = p_id.
    // auth or admin role required.
    router.post("/:u_id/reviews/:p_id", permit("auth", "admin"), async (req, res) => {
        const { u_id, p_id } = req.params;
        try {
            const result = await reviewService.createUserReview(p_id, u_id, req.body);
            res.status(201).send(result);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // removes user review by user with id = u_id for publication with id = p_id.
    // auth or admin role required.
    router.delete("/:u_id/reviews/:p_id", permit("auth", "admin"), async (req, res) => {
        const { u_id, p_id } = req.params;
        try {
            const result = await reviewService.removeUserReview(p_id, u_id);
            res.send(result);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    // updates user review by user with id = u_id for publication with id = p_id.
    // auth or admin role required.
    router.put("/:u_id/reviews/:p_id", permit("auth", "admin"), async (req, res) => {
        const { u_id, p_id } = req.params;
        try {
            const result = await reviewService.updateUserReview(p_id, u_id, req.body);
            res.send(result);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    })

    // returns a list of reccomendations for user with id = u_id,
    // sorted by rating from highest to lowest.
    // auth or admin role required.
    router.get("/:u_id/recommendation", permit("auth", "admin"), async (req, res) => {
        const { u_id } = req.params;
        try {
            const recommendations = await recommendationService.getRecommendationByUserId(u_id);
            res.send(recommendations);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });


    return router;
}
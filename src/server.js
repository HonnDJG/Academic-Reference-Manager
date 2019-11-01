module.exports = (context) => {
    const express = context("express");
    const app = express();
    const port = process.env.PORT || 5000;
    app.use(express.json());

    const boom = context('boom');

    const publicationRoute = context("publicationRoute")(context);
    const userRoute = context("userRoute")(context);

    app.use((req, res, next) => {
        req.query = new Proxy(req.query, {
            get: (target, name) => target[Object.keys(target)
                .find(key => key.toLowerCase() === name.toLowerCase())]
        })

        if (req.query.loanDate) {
            console.log(req.query.loanDate);
            req.query.loanDate = new Date(req.query.loanDate);

            if (req.query.loanDate == "Invalid Date") {
                const message = boom.badRequest('Invalid Date Input').output.payload;
                return res.status(message.statusCode).send(message)
            };

            req.query.loanDate.setHours(0, 0, 0, 0);
        }

        next();
    });

    app.use('/Publications', publicationRoute);
    app.use('/users', userRoute);

    return {
        listen: () => {
            app.listen(port, () => {
                console.log(`API up and listening on port: ${port}`)
            });
        }
    }
}
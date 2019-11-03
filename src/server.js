module.exports = (context) => {
    const express = context("express");
    const app = express();
    const port = process.env.PORT || 5000;
    app.use(express.json());

    const boom = context('boom');
    const moment = context('moment');

    const publicationRoute = context("publicationRoute")(context);
    const userRoute = context("userRoute")(context);

    app.use((req, res, next) => {
        req.query = new Proxy(req.query, {
            get: (target, name) => target[Object.keys(target)
                .find(key => key.toLowerCase() === name.toLowerCase())],
        });

        let { loanDate, loanDuration } = req.query;

        if (loanDate) {
            const parsedDate = moment(loanDate, "YYYY-MM-DD", true);

            if (!parsedDate.isValid()) {
                const message = boom.badRequest('Invalid Date Query').output.payload;
                return res.status(message.statusCode).send(message)
            };

            Object.keys(req.query).forEach(key => {
                if (key.toLowerCase() == 'loandate') {
                    req.query[key] = parsedDate.toDate();
                }
            });
        }

        if (loanDuration && isNaN(loanDuration)) {
            const message = boom.badRequest('Invalid Duration Query').output.payload;
            return res.status(message.statusCode).send(message)
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
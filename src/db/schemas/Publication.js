const mongoose = require('mongoose');

const PublicationSchema = mongoose.Schema(
    {
        editor_first_name: { type: String, required: true },
        editor_last_name: { type: String },
        publication_title: { type: String, required: true },
        isbn: { type: String, required: true },
        type: { type: String, enum: ['printed', 'electronic', null] },
        journal: { type: String },
        year: { type: Number, min: 0, max: 2100 },
        reviews: [
                { 
                 user: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
                 rating: { type: Number , min: 1, max: 5, required: true}
                }
            ]
    },
    {
        versionKey: false,
    }
);
PublicationSchema.statics = {
    getAllPublications: function() {
        return this.find({});
    },
    createPublication: function(publication) {
        return this.create(publication);
    },
    getPublicationById: function(id) {
        return this.findById(id);
    },
    removePublicationById: function(id) {
        return this.remove({_id: id});
    },
    updatePublicationById: function(id, body){
        return this.findOneAndUpdate(
            { _id: id},
            { $set: body},
            { new: true}
            );
    },
    getAllReviews: function(){
        const publications = this.find({});
        let result = [];
        publications.forEach(p => {
            result.push({
                publication: p.publication_title,
                reviews: p.reviews
            });
        });
        return result;
    },
    getReviewsByPublicationId: function(id){
        return this.publication.findById(id).select('reviews');
    },
    getReviewByPublicationAndUserId: function(publicationId, userId){
        const reviews = this.findById(publicationId).select('reviews');
        reviews.forEach(r => {
            if(r.user == userId){
                return r;
            }
        });
    },
    updateUserReview: function(publicationId, userId, review){
        /// ég er ekki viss um hvort að það virki að select'a reviews svona,
        /// og patcha það síðan inn í databaseinn, skilur mongo það?
        /// er mongo svona klárt?
        /// hvað skilur mongo ekki þá?
        /// all hail mongo our lord and savior!
        const reviews = this.findById(publicationId).select('reviews');
        for (let i = 0; i < reviews.length; i++) {
            if(userId == reviews[i].user){
                reviews[i] = reviews;
            }
        }
        return this.findOneAndUpdate(
            { _id: publicationId},
            { $set: reviews},
            { new: true}
            );
    },
    removeUserReview: function(publicationId, userId, review){
        /// sama og fyrir ofan
        const reviews = this.findById(publicationId).select('reviews');
        for (let i = 0; i < reviews.length; i++) {
            if(userId == reviews[i].user){
                reviews.splice(i, 1);
            }
        }
        return this.findOneAndUpdate(
            { _id: publicationId},
            { $set: reviews},
            { new: true}
            );
    }

}

module.exports = PublicationSchema;


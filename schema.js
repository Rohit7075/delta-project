// this js is created for schema validation
// which validate our achema from server side
const Joi=require("joi")
module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.string().required().min(0),
        image:Joi.string().allow("",null),

    }).required(),
})

// this is review validation from server side
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(0).max(5),
        comments:Joi.string().required()
    }).required(),
})
const schemaCleaner = schema => {
    schema.set('toJSON', {
        transform : (document, returnedObj) => {
            returnedObj.id = returnedObj._id.toString()
            delete returnedObj._id
            delete returnedObj.__v
            delete returnedObj.passwordHash
        }
    })
}

module.exports = schemaCleaner
const numberOfComments = commentsArray => {
    const numberOfReplies = commentsArray.map( c => c.replies.length ).reduce((sum, c) => sum+c, 0)
    return numberOfReplies + commentsArray.length
}

module.exports = numberOfComments
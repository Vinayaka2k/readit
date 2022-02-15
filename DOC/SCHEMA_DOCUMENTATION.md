### Schema

#### User

1. username
type    :   String   
(minlength, maxlength) : (3,20)
required

2. passwordHash
type    :   String
required

#### Comment

1. commentedBy
type    : ObjectId
references  :   User

2. commentBody
type    :   String
required

3. replies
type    :   Array

    a.  repliedBy
    type    :   ObjectId
    references  :   User

    b.  replyBody
    type    :   String
    required

#### Post

1. title
type    :   String
required
maxlength   :   40

2. mainContent
    postType           :   String
    textSubmission     :   String
    linkSubmission     :   String
    imageSubmission    :   String
        imageLink      :   String
        image_id       :   String
        
3. subreddit
type    :   ObjectId
references  :   Subreddit

4. author
type    :   String
references  :   User

5. upvotedBy
type    :   Array of ObjectId
references  :   User

6. upvotes
type    :   Number

7. comments
type    :   Array of commentSchema

#### Subreddit
var request = require('request-promise');
var mysql = require('promise-mysql');
var RedditAPI = require('./reddit');

function getSubreddits() {
    return request('https://www.reddit.com/.json')
        .then(
            response => {
            // Parse response as JSON and store in variable called result
            var result = JSON.parse(response); // continue this line
                var formattedRedditArray = result.data.children.map(function(jjj){
               return jjj.data.subreddit;
               });
            //  console.log(formattedRedditArray);
           return formattedRedditArray;
        });
}
//getSubreddits();
function getPostsForSubreddit(subredditName) {
    return request('https://www.reddit.com/r/'+subredditName+'.json')
        .then(
            response => {
                var result = JSON.parse(response); // continue this line
                var formattedRRR = result.data.children.filter(function(ccc){
                        if (!ccc.data.is_self)
                        {return ccc.data.subreddit; }
                    })
                  .map(function(ddd){
                  var RedObj = {
                      title:ddd.data.title,
                      url:ddd.data.url,
                      user:ddd.data.author}
                  //console.log(RedObj["title"]);
                 return RedObj;
            }
        );
        return formattedRRR;
}
)}


getPostsForSubreddit('Toronto');

// function crawl() {
//     // create a connection to the DB
//     var connection = mysql.createPool({
//         host     : 'localhost',
//         user     : 'root',
//         password : '',
//         database: 'reddit',
//         connectionLimit: 10
//     });

//     // create a RedditAPI object. we will use it to insert new data
//     var myReddit = new RedditAPI(connection);

//     // This object will be used as a dictionary from usernames to user IDs
//     var users = {};

//     /*
//     Crawling will go as follows:
//         1. Get a list of popular subreddits
//         2. Loop thru each subreddit and:
//             a. Use the `createSubreddit` function to create it in your database
//             b. When the creation succeeds, you will get the new subreddit's ID
//             c. Call getPostsForSubreddit with the subreddit's name
//             d. Loop thru each post and:
//                 i. Create the user associated with the post if it doesn't exist
//                 2. Create the post using the subreddit Id, userId, title and url
//      */

    // Get a list of subreddits
//     getSubreddits()
//         .then(subredditNames => {
//             subredditNames.forEach(subredditName => {
//                 var subId;
//                 myReddit.createSubreddit({name: subredditName})
//                     .then(subredditId => {
//                         subId = subredditId;
//                         return getPostsForSubreddit(subredditName)
//                     })
//                     .then(posts => {
//                         posts.forEach(post => {
//                             var userIdPromise;
//                             if (users[post.user]) {
//                                 userIdPromise = Promise.resolve(users[post.user]);
//                             }
//                             else {
//                                 userIdPromise = myReddit.createUser({
//                                     username: post.user,
//                                     password: 'abc123'
//                             })
//                             .catch(function(err) {
//                                     return users[post.user];
//                                 })
//                             }

//                             userIdPromise.then(userId => {
//                                 users[post.user] = userId;
//                                 return myReddit.createPost({
//                                     subredditId: subId,
//                                     userId: userId,
//                                     title: post.title,
//                                     url: post.url
//                                 });
//                             });
//                         });
//                     });
//             });
//         });
// }
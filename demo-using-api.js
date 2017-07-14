// load the mysql library
var mysql = require('promise-mysql');

// create a connection to our Cloud9 server
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'mattszabo', // CHANGE THIS :)
    password : '',
    database: 'reddit',
    connectionLimit: 10
});

// load our API and pass it the connection
var RedditAPI = require('./reddit');

var myReddit = new RedditAPI(connection);

// We call this function to create a new user to test our API
// The function will return the newly created user's ID in the callback

// myReddit.createSubreddit({ name: 'John Charleds', description: 'nodescription'})

// .then(newSubreddit => {
//         // Now that we have a user ID, we can use it to create a new post
//         // Each post should be associated with a user ID
//         console.log('New subreddit created! ID= ' + newSubreddit);
// })
//     .then(function(){
//     connection.end();
//     })
//     .catch(error => {
//         console.log(error.stack);
//     });

    
// myReddit.getAllSubreddits().then(function(data){
//     //data.forEach(postlist => {
//         //console.log(postlist);
//         var formattedArray = data.map(subs =>{
//             var prettySub = {
//                 id: subs.id,
//                 name:subs.name,
//                 description:subs.description,
//                 createdAt:subs.createdAt,
//                 updatedAt:subs.updatedAt,
    
//                 }

//             //prettyObj.reverse();
//                 console.log(prettySub["id"]+" " +prettySub["updatedAt"]);
//         });
    
//         return formattedArray;
        
//     }).then(function(){
        // connection.end();
        // })
        // .catch(error => {
//       console.log(error.stack);
//      });
// 
// myReddit.createUser({
//     username: 500*Math.random(),
//     password: 'abc123'
// })
//     .then(newUserId => {
//         // Now that we have a user ID, we can use it to create a new post
//         // Each post should be associated with a user ID
//         console.log('New user created! ID=' + newUserId);

//         return myReddit.createPost({
//             title: 'Hello Reddit! This is my first post',
//             url: 'http://www.digg.com',
//             userId: newUserId,
//             subredditId: 14
//         });
//     })
//     .then(newPostId => {
//         // If we reach that part of the code, then we have a new post. We can print the ID
//         console.log('New post created! ID=' + newPostId);
//     }).then(function(){
//     connection.end();
//     })
//     .catch(error => {
//         console.log(error.stack);
//     });
    
    // connection.query(
    //          `
    //         SELECT id, title, url, userId, createdAt, updatedAt
    //         FROM posts
    //         ORDER BY createdAt DESC
    //         LIMIT 25`
    //         ).then(function(data){
                
    //             console.log(data);
                
                
    //         });
    
myReddit.getAllPosts().then(function(data){

        var formattedArray = data.map(post =>{
            var prettyObj = {
                id: post.id,
                voteScore: post.voteScore,
                title: post.title,
                url: post.url,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                user:
                {
                user_id: post.userId,
                username: post.username,
                createdAt: post.userCreated,
                updatedAt: post.userUpdated,
                },
                subreddit:
                {
                name: post.subredditName,
                description: post.subredditDesc,
                subcreate: post.subCreated,
                subupdate: post.subUpdated
                }
                
            };
             console.log(prettyObj);
               
             return formattedArray;
             
            //prettyObj.reverse();
            // console.log(prettyObj["user.user_id"]);
            //console.log(prettyOb[subreddit]);
               
      });
})
.then(function(){
connection.end();
     })
    .catch(error => {
      console.log(error.stack);
     });

// myReddit.createVote({
//     userId: '8',
//     postId: '5',
//     voteDirection: 1
// }).then(function(){
//     connection.end();
//     })
//     .catch(error => {
//         console.log(error.stack);
//     });
    



"use strict";

var bcrypt = require('bcrypt-as-promised');
var HASH_ROUNDS = 10;

class RedditAPI {
    constructor(conn) {
        this.conn = conn;
    }

    createUser(user) {
        /*
        first we have to hash the password. we will learn about hashing next week.
        the goal of hashing is to store a digested version of the password from which
        it is infeasible to recover the original password, but which can still be used
        to assess with great confidence whether a provided password is the correct one or not
         */
        return bcrypt.hash(user.password, HASH_ROUNDS)
            .then(hashedPassword => {
                return this.conn.query('INSERT INTO users (username,password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())', 
                [user.username, hashedPassword]);
            })
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Special error handling for duplicate entry
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A user with this username already exists');
                }
                else {
                    throw error;
                }
            });
    }

    createPost(post) {
        
        if(!post.subredditId){
            throw new Error('Missing subredditId');
            
            
        }
        else{
        return this.conn.query(
            `
            INSERT INTO posts (userId, title, url, subredditId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?,NOW(), NOW())`,
            [post.userId, post.title, post.url,post.subredditId]
        )
            .then(result => {
                return result.insertId;
            });
    }
    }
        createSubreddit(subreddit) {
        return this.conn.query(
            `
            INSERT INTO subreddits (name,description, createdAt, updatedAt)
            VALUES (?, ?,NOW(), NOW())`,
            [subreddit.name, subreddit.description]
        )
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Special error handling for duplicate entry
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A subreddit with this name already exists');
                }
                else {
                    throw error;
                }
            });
    }

    getAllPosts() {
        /*
        strings delimited with ` are an ES2015 feature called "template strings".
        they are more powerful than what we are using them for here. one feature of
        template strings is that you can write them on multiple lines. if you try to
        skip a line in a single- or double-quoted string, you would get a syntax error.

        therefore template strings make it very easy to write SQL queries that span multiple
        lines without having to manually split the string line by line.
         */
        return this.conn.query(
            
           
        //     SELECT posts.id, posts.title, posts.url, posts.createdAt, posts.updatedAt, posts.userId, users.username, users.createdAt as userCreated, users.updatedAt as userUpdated,subreddits.name as subredditName, subreddits.description as subredditDesc, subreddits.createdAt as subCreated, subreddits.updatedAt as subUpdated
        //     FROM posts
        //     LEFT JOIN users ON posts.userId = users.id
        //     LEFT JOIN subreddits ON posts.subredditId = subreddits.id;
            
        
        
       `SELECT posts.id, SUM(votes.voteDirection) as voteScore,posts.title, posts.url,  posts.createdAt, posts.updatedAt,  posts.userId,  users.username,  users.createdAt as userCreated,  users.updatedAt as userUpdated, subreddits.name as subredditName, subreddits.description as subredditDesc, subreddits.createdAt as subCreated, subreddits.updatedAt as subUpdated, votes.voteDirection as voteDirection  FROM posts LEFT JOIN users ON posts.userId = users.id LEFT JOIN subreddits ON posts.subredditId = subreddits.id LEFT JOIN votes ON posts.id = votes.postId GROUP BY posts.id ORDER BY voteScore DESC;`
    );
        
    }
    
    getAllSubreddits() {
       
        return this.conn.query(
            `
            SELECT subreddits.id, subreddits.name, subreddits.description, subreddits.createdAt, subreddits.updatedAt
            FROM subreddits
            ORDER BY createdAt DESC`
        );
    }
    
    createVote(vote) {
        return this.conn.query(
            
            `INSERT INTO votes SET postId=?, userId=?, voteDirection=? ON DUPLICATE KEY UPDATE voteDirection=?;`,
            [vote.postId, vote.userId, vote.voteDirection, vote.voteDirection]
        )
            .then(result => {
                return result.insertId;
            });
    
}
}
module.exports = RedditAPI;
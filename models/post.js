"use strict";

const db = require("../db");
const { UnauthorizedError } = require("../expressError");
const { BadRequestError } = require("../expressError");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Post functions */

class Post {
  /** Add post.
   *
   * Returns { id, username, title, text, post_date }
   *
   * Throws BadRequestError with invalid username.
   **/

  static async addPost({ username, title, text }) {
    const validateUsername = await db.query(
      `SELECT username
             FROM users
             WHERE username = $1`,
      [username]
    );

    if (validateUsername.rows[0]) {
      throw new BadRequestError(`Username does not exist: ${username}`);
    }

    const result = await db.query(
      `INSERT INTO posts
             (username, title, text)
             VALUES ($1, $2, $3)
             RETURNING id, username, 
              title, text, 
              post_date AS "postDate"`,
      [username, title, text]
    );

    const post = result.rows[0];

    return post;
  }
}

module.exports = Post;

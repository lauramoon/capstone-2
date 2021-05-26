CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  about VARCHAR(200),
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  title VARCHAR(50) NOT NULL,
  text VARCHAR(500) NOT NULL,
  post_date timestamp with time zone NOT NULL
);

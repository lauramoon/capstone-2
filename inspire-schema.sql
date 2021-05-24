CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  about VARCHAR(200) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE users (
  id serial PRIMARY KEY,
  email text,
  password_digest text
);

CREATE TABLE keys (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id),
  value text,
  enabled boolean DEFAULT true
);

CREATE TABLE requests (
  request_id serial PRIMARY KEY,
  key_id integer REFERENCES keys(id),
  created_at TIMESTAMP DEFAULT now(),
  location text
);
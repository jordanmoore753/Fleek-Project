# IPFS Manager

Welcome to IPFS Manager. You can create API keys through which you can make requests to a running IPFS node.

## Setup Instructions

1. `git clone` this repository.
2. At the root of the repository, run `docker-compose up -d`.
3. Visit `localhost` in your browser.
4. Create an account at `/register`. Email must be valid and password must be 8 characters or more.
5. Create API keys using the 'Create API Key' button.
6. Requests will populate in table form underneath the API key that was used to make the request with.
7. Disable an API key by clicking the 'Disable' button. This is irreversible.

## Technologies

Nginx is the reverse proxy running all of these various services. The services are:

1. Express (Node.js) application that verifies requests, handles user authentication, and performs CRUD on keys.
2. PostgreSQL for data persistence of requests, keys, and users.
3. React for the frontend client, IPFS Manager.

Nginx serves the React app as static files at `/`. The Express server is at `/app` and PG is unreachable. 

## Written Questions

I would do several things if I were shipping this to production.

1. I would use Kubernetes instead of Docker-Compose for deployment and managing containerized services. DC isn't production-ready.
2. Kubernetes would allow for replication of nodes to keep IPFS data safe and replicated.
3. Security wise this isn't the best. I would need to enforce strong cookie settings, as this implementation is pretty loose with the CORS requests that I used for development and testing.
4. I would create unit and integration tests for the Express server and React applications.
5. I would use Traefik as a reverse proxy that provides SSL termination for requests that then get forwarded to Nginx.
6. This was my first introduction to IPFS and I really enjoyed working with it. As I understand it right now, IPFS is similar to torrenting, where individual machines host content that can be found and downloaded by other machines on a distributed network of machines. HTTP is kind of like finding a book by specifying its location, like 'I want to find the book on the third shelf and five from the right'; whereas, IPFS is actually specifying the book by its content to find it.


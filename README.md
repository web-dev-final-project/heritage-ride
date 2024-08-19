# web-programming-final

<div align="center">
  <h1 align="center">Heritage Ride</h1>
  <h3 align="center">Group project for summer 2024 class CS-546wn.</h3>
  <p align="center">
  </p>
  <p>https://github.com/web-dev-final-project/heritage-ride.git</p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#details">Prerequisites</a></li>
      </ul>
    </li>

  </ol>
</details>

## About The Project

    This is the final project for 2024 Summer Class CS-546wn of SIT.

### Built With

    Express, Handlebars, Bootstrap, MongoDB

### Installation

1. Get required secrets from the developer team
2. Clone the repo (recommanded)
   ```sh
   git clone https://github.com/web-dev-final-project/heritage-ride.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create .env file in the root folder, then enter and save your secrets in the .env
   ```sh
   DB_SERVER=your_mongodb_srv_url
   DB_NAME=database_name
   ```
5. Run server, (server will be create at port 4000, you can change that by add PORT=number in .env file)
   ```sh
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Details

<ul><h4>This project currently support 3 user roles.</h4></ul>
    <li>user: which is default when creating an account;</li>
    <li>seller: automatically assigned when creating a listing;</li>
    <li>expert: user have to sign up for expert role.</li>
<hr />
As a seller, users can add a listing for their collections, including cars or parts. For car collections, users can send a request to a certified expert for a car review (inspection). Experts will be able to track all requests in the Expert Central and respond from there.

The payment system is delegated to Stripe.com, and the maximum supported online transaction is 1 million US dollars.

<ul>A listing can have 4 different state: open, reserved, sold, delisted.</ul>
<li>A open listing will show up in the search result.</li>
<li>A reserved state means buyer has already paid, but seller not yet confirmed</li>
<li>Once the seller confirmed the payment, the listing state will be change to sold</li>
<li>Buyer can see all reserved or sold listings in their profile page</li>
<li>listing can be delete by the seller in the seller central, and it will be marked as delisted and still remain in the system for tax purposes</li>

<hr/>
<h5>Technical details</h5>
<p>Error are handled with custom error middleware</p>
<p>Logger is inserted to monitor site traffic exclude static files delivery</p>
<p>Image is hosted using cloudinary, a new image url is generated for each upload</p>

## Features

- [x] Search bar for searching cars and parts
- [x] Listing features for add trading cars and parts on the market
- [x] User profile and management
- [x] Seller page to add listings and manage listings
- [x] Experts page to find expert
- [x] Expert profile page for marketing

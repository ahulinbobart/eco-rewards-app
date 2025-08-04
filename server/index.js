const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

// require for connection between frontend and back end
app.use(cors());

// parse information from frontend
app.use(express.json());


// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
// to set root to be 'password'
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'admin',
  database: 'usersystem',
})

// insert new user into database
app.post('/register', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.send("Please fill in username and password")
  } else {
    db.query('INSERT INTO users (email, password, points) VALUES (?,?,0)',
    [email, password], (err, result) => {
      if (err) {
        res.send("There is either a network error or username exists in database already");
      } else {
        res.send("Values inserted");
      }
    });
  }
});

// get user ID when user attempts to login based on password and email of user
// can also be used to get current points of user to be updated
app.get('/getUserData', (req, res) => {

  const email = req.query.email;
  const password = req.query.password;

  db.query('SELECT * FROM users WHERE email = (?) AND password = (?)', 
  [email, password], (err, result) => {
    if (err) {
      res.send("Error")
    } else {
      res.send(result);
    }
  }
  );
});

// used to update user points earned or used during checkout or spending on rewards. Ensure that points is processed before function is used to update database
app.put('/updateUserPoints', (req, res) => {

  const userID = req.body.userID;
  const updatedPoints = req.body.points;

  db.query('UPDATE users SET points = points + (?) WHERE id = (?)', 
  [updatedPoints, userID], (err, result) => {
    if (err) {
      res.send("Error")
    } else {
      res.send("Update was successful");
    }
  }
  );

  if(updatedPoints > 0) {
    //user got points, update history
    const message = "Earned " + updatedPoints + " points buying green items."
    db.query('INSERT INTO history (userid, timestamp, message) VALUES (?,NOW(),  ? )',
      [userID, message], (err, result) => {

      }
      );
  } else if (updatedPoints < 0) {
    //user redeemed reward, add to history
    db.query('INSERT INTO history (userid, timestamp, message) VALUES (?,NOW(), "Redeemed a $10 reward voucher.")',
      [userID], (err, result) => {

      }
      );
  }
});

// insert new shopping trip when checkout button is clicked for grocery list
app.post('/registerShoppingCheckout', (req, res) => {

  const userID = req.body.userID;
  const date = req.body.date;
  const points = req.body.points;

  db.query('INSERT INTO shoppingtrip (userID, date, pointsEarned) VALUES (?,NOW(), ?)',
  [userID, date, points], (err, result) => {
    if (err) {
      res.send("There should not be identical shopping trip registering")
    } else {
      res.send("Checkout success!");
    }
  }
  );
});

// find all shopping trip history for a specific user with userID
// if userID is not found - it means that user has not checked out before
app.get('/getUserHistory', (req, res) => {

  const userID = req.query.userID;

  db.query('SELECT * FROM history WHERE userID = (?)', 
  [userID], (err, result) => {
    if (err) {
      res.send("Error")
    } else {
      if (result) {
        res.send(result);
      } else {
        res.send("User has not checked out before!");
      }
    }
  }
  );
});

// get product data to be used to acquire relevant ratings and product description
app.post('/getProductData', (req, res) => {

  const category = req.body.category;
  db.query('SELECT * FROM products WHERE category = (?)', 
  [category], (err, result) => {

    if (err) {
      res.send("Error")
    } else {
      if (result) {
        if(result.length === 0) {
          // product category is not in the database, add placeholder data
          db.query('INSERT INTO products (category, emissionRating, waterRating, landRating) VALUES (?,0,0,0)', 
          [category], (err, result) => {
            if (err) {
                res.send("Error adding new category");
              } else {
                res.send("Product data category is not found in database!");
              }
          });
          } else {
            res.send(result);
          }
      } else {
        res.send("Product data category is not found in database!");
      }
    }
  });

});

// get all rewards which has description, file path and name each row
app.get('/getRewardsData', (req, res) => {

  db.query('SELECT * FROM rewards', (err, result) => {
    if (err) {
      res.send("Error")
    } else {
      if (result) {
        res.send(result);
      } else {
        res.send("No rewards found in database!");
      }
    }
  }
  );
});

// check to see if user has redeemed a particular reward
app.get('/checkIfUserRedeemReward', (req, res) => {

  const userID = req.query.userID;
  const rewardID = req.query.rewardID;

  db.query('SELECT * FROM userrewards WHERE userID = (?) AND rewardID = (?)', 
  [userID, rewardID], (err, result) => {
    if (err) {
      res.send("Error")
    } else {
      if (result) {
        // user has redeemed reward before
        res.send(true);
      } else {
        // user has not redeemed reward before
        res.send(false);
      }
    }
  }
  );
});

// check to see if user has redeemed a particular reward
app.get('/getUserRedeemNumber', (req, res) => {

  const userID = req.query.userID;
  const rewardID = req.query.rewardID;

  db.query('SELECT redeemNumber FROM userrewards WHERE userID = (?) AND rewardID = (?)', 
  [userID, rewardID], (err, result) => {
    if (err) {
      res.send("Error")
    } else {
      if (result) {
        // user has redeemed reward before
        res.send(result);
      } else {
        // user has not redeemed reward before
        // so by default - it should be 0
        res.send(0);
      }
    }
  }
  );
});

// register user to database when a particular reward has been redeemed by user
// insert new shopping trip when checkout button is clicked for grocery list
app.post('/registerUserRedeemReward', (req, res) => {

  const userID = req.body.userID;
  const rewardID = req.body.rewardID;

  // by default will be set to 1 if no value is passed but can be sent as an argument when registering into database for completeness 
  const redeemNum = req.body.redeemNum;

  db.query('INSERT INTO userrewards (userID, rewardID, redeemNumber) VALUES (?,?, ?)', 
  [userID, rewardID, redeemNum], (err, result) => {
    if (err) {
      res.send("Reward has already been redeemed by user!")
    } else {
      res.send("Reward has been redeemed by user!");
    }
  }
  );
});

// updates the number of times user has redeem specific reward
app.put('/updateUserRedeemReward', (req, res) => {

  const userID = req.body.userID;
  const rewardID = req.body.rewardID;
  const redeemNum = req.body.redeemNum;

  db.query('UPDATE SET userrewards redeemNumber = (?) WHERE userID = (?) AND rewardID = (?)', 
  [redeemNum, userID, rewardID], (err, result) => {
    if (err) {
      res.send("Error")
    } else {
      res.send("User has redeemed reward!");
    }
  }
  );
});

// indicate that server is running
app.listen(3001, () => {
  console.log("Server is running");
});

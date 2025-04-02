// Load the express module
var con=require('./connection');
const express = require('express');
const app = express();
const path = require('path');
var bodyParser=require('body-parser');
var session = require('express-session');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Define a route for the root URL (/)
// app.get('/', (req, res) => {
//   // Send the index.html file as a response
//   res.sendFile(path.join(__dirname, 'register.html'));
// });
app.use(express.static(path.join(__dirname, 'public')));

// const session = require('express-session');
app.set('view engine', 'ejs');
app.use(session({
  secret: 'secret_key',
  resave: true,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  // Send the home page (index.html) as a response
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/index', (req, res) => {
  // Send the home page (index.html) as a response
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/home1', (req, res) => {
  // Send the home page (index.html) as a response
  res.render('home1');
});

app.get('/userabout', (req, res) => {
  // Send the home page (about.html) as a response
  res.sendFile(path.join(__dirname, 'userabout.html'));
});

app.get('/about', (req, res) => {
  // Send the home page (about.html) as a response
  res.sendFile(path.join(__dirname, 'about.html'));
});
// Define a route for the register page
app.get('/register', (req, res) => {
  // Send the register page (register.html) as a response
  res.sendFile(path.join(__dirname, 'register.html'));
});
app.post('/register',function(req,res)
{
    var username=req.body.username;
    var email=req.body.email;
    var password=req.body.password;

    con.connect(function(error)
{
    if(error) throw error;
    var sql="insert into register(username,email,password)values(?,?,?)";
    con.query(sql,[username,email,password],function(error,result)
    {

    
    if(error) throw error;
    res.send('Student Register successfull');  });

});

});

app.get('/login1', (req, res) => {
  res.sendFile(path.join(__dirname, 'login1.html'));
});
app.post('/login1', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  con.connect(function(error) {
      if (error) throw error;

      var sql = "SELECT * FROM register WHERE email = ? AND password = ?";
      con.query(sql, [email, password], function(error, results) {
          if (error) throw error;

          if (results.length > 0) {
              // Set session variable to indicate login
              req.session.loggedin = true;
              req.session.username = results[0].username;
              // req.session.user={username};
              // Redirect to the home page
              res.redirect('/home');
          } else {
              res.send('Incorrect Email and/or Password!');
          }
      });
  });
});


app.get('/home', function(req, res) {
  if (req.session.loggedin) {
    // Pass the username to the EJS template
    res.render('home', { username: req.session.username });
  } else {
    res.send('Please login to view this page!');
  }
});

// app.get('/home', function(req, res) {
//   if (req.session.user) {
//     // Pass the username to the EJS template
//     res.render('home', { username: req.session.user.username });
//   } else {
//     res.send('Please login to view this page!');
//   }
// });



app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/index');
});

app.get('/getAllinfo', (req, res) => {
  // Send the register page (register.html) as a response
  res.sendFile(path.join(__dirname, 'getAllinfo.html'));
});

app.get('/home', (req, res) => {
  const username = req.session.username; // Assuming you store the username in the session
  res.render('home', { username }); // Render EJS template and pass username
});

// Route to handle form submission and search for colleges
app.post('/getAllinfo', (req, res) => {
  const { cityInput, marksInput, branchInput, cityCheck, marksCheck, branchCheck } = req.body;

  // Start building the dynamic query
  let query = 'SELECT * FROM colleges WHERE 1=1';
  const queryParams = [];
  if (cityCheck && cityInput && cityInput.trim() !== '') {
    query += ` AND city = '${cityInput}'`;
}

// Filter by marks if checkbox is checked and input is provided
if (marksCheck && marksInput && marksInput.trim() !== '') {
    query += ` AND marks >= ${marksInput}`;
}

// Filter by branch if checkbox is checked and input is provided
if (branchCheck && branchInput && branchInput.trim() !== '') {
    query += ` AND branch = '${branchInput}'`;
}

// Check if at least one filter has been applied, if not return all colleges
if (query === 'SELECT * FROM colleges WHERE 1=1') {
  // No filters applied, return all colleges
  return res.render('result', { colleges: [] }); // Optionally you can return all colleges here if you want.
}
console.log('Final SQL Query:', query);
  // Execute the query with parameters
  con.query(query, queryParams, (err, results) => {
      if (err) {
          console.error(err); // Log the error
          return res.status(500).send('Internal Server Error'); // Send an error response
      }

      // Render the results page and pass the results to the view
      res.render('result', { colleges: results });
  });
});

// Random colleges route
app.get('/random-colleges', (req, res) => {
  // Query to get random colleges (let's say 5 random colleges)
  let query = 'SELECT name, website FROM colleges ORDER BY RAND() LIMIT 5';

  // Execute the query
  con.query(query, (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Server error');
      }

      // Render the random-colleges page and pass the random college list
      res.render('random-colleges', { colleges: results });
  });
});



// Start the server on port 5500
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





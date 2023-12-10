const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
 

const app = express();
app.use(cors());
// Middleware
app.use(bodyParser.json());
const port = 3000;

 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Saniya@123',
  database: 'test',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.message);
    process.exit(1);
  } else {
    console.log('Connected to the database');
  }
});


 

// Routes
app.get('/api/questions', (req, res) => {
  db.query('SELECT * FROM questionbank', (err, results) => {
    if (err) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

 
 

app.post('/api/questions', (req, res) => {
  const { question, options, correctAnswer } = req.body;
 

  const query = `INSERT INTO questionbank (question, option1, option2, option3, option4, correctanswer)
                 VALUES (?, ?, ?, ?, ?, ?)`;

  // const values = [question, options[0].text, options[1].text, options[2].text, options[3].text, correctAnswer];
  const values = [
    question,
    combineTextAndImage(options[0]),
    combineTextAndImage(options[1]),
    combineTextAndImage(options[2]),
    combineTextAndImage(options[3]),
    correctAnswer
  ];
  function combineTextAndImage(option) {
    return `${option.text}|${option.image}`;
  }

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error inserting question:', err);
          res.status(500).json({ error: 'Error inserting question' });
      } else {
          res.status(200).json({ message: 'Question submitted successfully' });
      }
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});






 














 
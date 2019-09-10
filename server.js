const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());


server.get('/accounts', (req, res) => {
  // LIMIT Controls the maximum request body size. If this is a number, then the value specifies 
  // the number of bytes; if it is a string, the value is passed to the bytes library for 
  // parsing

    const { limit, orderby } = req.query;
    // const query = db.select('*').from('accounts');
    const query = db('accounts')
    if (limit) {
      query.limit(limit);
    }
    if (orderby) {
      query.orderBy(orderby);
    }

    query
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(error => {
      res.status(500).json({ message: 'error getting the account from db' });
    });
}); //endpoint works

server.get('/accounts/:id', (req, res) => {
    db('accounts')
      .where({ id: req.params.id })
      .first()
      .then(account => {
        res.status(200).json(account);
      })
      .catch(error => {
        res.status(500).json({ message: 'error getting the account from db' });
      });
}); //endpoint works

server.post('/accounts', (req, res) => {
    const account = req.body;
    // validate the the account data is correct before saving to the db
    db('accounts')
      .insert(account, 'id')
      .then(account=> {
        res.status(200).json(account);
      })
      .catch(error => {
        res.status(500).json({ message: 'error saving the account to the db' });
      });
}); //endpoint works

server.put('/accounts/:id', (req, res) => {
    const changes = req.body;
  
    db('accounts')
      .where('id', '=', req.params.id)
      .update(changes)
      .then(count => {
        if (count > 0) {
          res.status(200).json(count);
        } else {
          res.status(404).json({ message: 'not found' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'error updating the account' });
      });
}); //endpoint works

server.delete('/accounts/:id', (req, res) => {
    db('accounts')
      .where({id:req.params.id})
      .del()
      .then(count => {
        if (count > 0) {
          res.status(200).json(count);
        } else {
          res.status(404).json({ message: 'not found' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'error removing the account' });
      });
}); //endpoint works

module.exports = server;
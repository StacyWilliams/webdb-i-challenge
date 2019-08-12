const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    const { limit, orderby } = req.query;
  
    const query = db.select('*').from('accounts');
    // const query = db('accounts')
  
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
});

server.get('/:id', (req, res) => {
    db('accounts')
      .where({ id: req.params.id })
      .first()
      .then(account => {
        res.status(200).json(account);
      })
      .catch(error => {
        res.status(500).json({ message: 'error getting the account from db' });
      });
  });

server.post('/', (req, res) => {
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
  });

  server.put('/:id', (req, res) => {
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
  });

  server.delete('/:id', (req, res) => {
    db('accounts')
      .where('id', '=', req.params.id)
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
  });

module.exports = server;
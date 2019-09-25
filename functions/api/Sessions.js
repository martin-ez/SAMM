const express = require('express');
const createSession = require('../src/SongGenerator');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const sessionsCollection = admin.firestore().collection('sessions');
const sessionsApi = express.Router();

/**
 * Create a new private session
 */
sessionsApi.get('/new', (req, res) => {
  const newSess = createSession();
  newSess.private = true;
  return sessionsCollection.add(newSess).then((docRef) => {
    console.log(`NEW PRIVATE SESSION CREATED: ${docRef.id}`);
    return res.status(200).send({id: docRef.id, status: 'player'});
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: 'There was something wrong when conecting to database.', err});
  });
});

/**
 * Join a free session
 */
sessionsApi.get('/join', (req, res) => {
  const query = sessionsCollection.where('currentPlayers', '<', 3).where('private', '==', false);
  let sessId = null;
  return query.get().then((snapshot) => {
    if (snapshot.docs.length > 0) {
      sessId = snapshot.docs[0].id;
      const sessData = snapshot.docs[0].data();
      return sessionsCollection.doc(sessId).update({currentPlayers: sessData.currentPlayers + 1});
    } else {
      return sessionsCollection.add(createSession());
    }
  }).then((docRef) => {
    if (sessId) {
      console.log(`JOINED FREE SESSION: ${sessId} at ${docRef.updateTime}`);
      return res.status(200).send({id: sessId, status: 'player'});
    } else {
      console.log(`NEW FREE SESSION CREATED: ${docRef.id}`);
      return res.status(200).send({id: docRef.id, status: 'player'});
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: 'There was something wrong when conecting to database.', err});
  });
});

/**
 * Join an specific session
 */
sessionsApi.get('/join/:sid', (req, res) => {
  let sessId = req.params.sid;
  let available = false;
  return sessionsCollection.doc(sessId).get().then((snapshot) => {
    if (snapshot.exists) {
      const sessData = snapshot.data();
      available = sessData.currentPlayers < 3;
      return sessionsCollection.doc(sessId).update(available ? {currentPlayers: sessData.currentPlayers + 1} : {audience: sessData.audience + 1});
    } else {
      return res.status(404).send(`A session with that id doesn't exists`);
    }
  }).then((updatedDoc) => {
    if (available) {
      console.log(`JOINED SESSION: ${sessId} at ${updatedDoc.updateTime}`);
      return res.status(200).send({id: sessId, status: 'player'});
    } else {
      console.log(`JOINED SESSION AUDIENCE: ${sessId} at ${updatedDoc.updateTime}`);
      return res.status(200).send({id: sessId, status: 'audience'});
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: 'There was something wrong when conecting to database.', err});
  });
});

/**
 * Leave a session
 */
sessionsApi.get('/leave/:sid', (req, res) => {
  let sessId = req.params.sid;
  return sessionsCollection.doc(sessId).get().then((snapshot) => {
    if (snapshot.exists) {
      const sessData = snapshot.data();
      return sessData.currentPlayers === 1 ? sessionsCollection.doc(sessId).delete() : sessionsCollection.doc(sessId).update({currentPlayers: sessData.currentPlayers - 1});
    } else {
      return res.status(404).send(`A session with that id doesn't exists`);
    }
  }).then((updatedDoc) => {
    if (updatedDoc) {
      console.log(`LEAVE SESSION: ${sessId} at ${updatedDoc.updateTime}`);
      return res.status(200).send({id: sessId, status: 'leave'});
    } else {
      console.log(`SESSION DELETED: ${sessId}`);
      return res.status(200).send({id: sessId, status: 'leave'});
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: 'There was something wrong when conecting to database.', err});
  });
});

/**
 * Leave a session audience
 */
sessionsApi.get('/leave/:sid/audience', (req, res) => {
  let sessId = req.params.sid;
  return sessionsCollection.doc(sessId).get().then((snapshot) => {
    if (snapshot.exists) {
      const sessData = snapshot.data();
      return sessionsCollection.doc(sessId).update({audience: sessData.audience - 1});
    } else {
      return res.status(404).send(`A session with that id doesn't exists`);
    }
  }).then((updatedDoc) => {
    console.log(`LEAVE SESSION AUDIENCE: ${sessId} at ${updatedDoc.updateTime}`);
    return res.status(200).send({id: sessId, status: 'leave'});
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: 'There was something wrong when conecting to database.', err});
  });
});

module.exports = sessionsApi;

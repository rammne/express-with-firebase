// const express = require('express');
// const { initializeApp } = require('firebase/app');
// const { getDatabase, ref, push, onValue, get, child } = require('firebase/database');

import express from 'express';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, get } from 'firebase/database';

const app = express();
const PORT = 3000;

// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://crud-operation-js-ce264-default-rtdb.asia-southeast1.firebasedatabase.app/", // <-- change this to yours
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const dbRef = ref(db, 'todos');

// Middlewares
// app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
    const snapshot = await get(dbRef);
    let todos = [];
    if (snapshot.exists()) {
        const data = snapshot.val();
        todos = Object.entries(data).map(([id, value]) => ({ id, value }));
    }
    res.render('index.ejs', { todos });
});

app.post('/add', (req, res) => {
    const todo = req.body.todo;
    if (todo && todo.trim() !== '') {
        push(dbRef, todo.trim());
    }
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

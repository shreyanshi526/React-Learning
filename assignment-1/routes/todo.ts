// const express = require('express');
import {  Request, Response } from "express";
import express from 'express'
// const { authenticateJwt, SECRET } = require("../middleware/index");
import { authenticateJwt,SECRET } from "../middleware";
// const { Todo } = require("../db");
import { Todo } from "../db";
import { title } from "process";

const router = express.Router();

interface CreateTodoInput  {
  title : string,
  description : string
}


//zod input validation libraries
router.post('/todos', authenticateJwt, (req,res) => {  //req:Request, res:Response no need for this (infer concept)
  const input :  CreateTodoInput = req.body;
  const done = false;
  const userId = req.headers["userId"];  

  const newTodo = new Todo({ title : input.title, description: input.description, done, userId });

  newTodo.save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});


router.get('/todos', authenticateJwt, (req,res) => {
  const userId = req.headers["userId"];

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

router.patch('/todos/:todoId/done', authenticateJwt, (req,res) => {
  const { todoId } = req.params;
  const userId = req.headers["userId"];

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(updatedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update todo' });
    });
});

export default router;
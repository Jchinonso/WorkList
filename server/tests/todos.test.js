import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Todo from '../models/Todos';
import User from '../models/Users';

const request = supertest(app);
const { expect } = chai;
let token;
let todoId;
let taskId;

describe('Todo Controller', () => {
  before((done) => {
    request.post('/api/v1/user/signup')
      .send({
        name: 'kunle adewale',
        email: 'kunle@gmail.com',
        password: 'password',
        username: 'kool4life'
      })
      .end((err, res) => {
        token = res.body.token;
        return done();
      });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(done);
  });
  it('should send an error message if there are no todos to be retrieved', (done) => {
    request.get('/api/v1/todo')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('No todos found');
        return done();
      });
  });
  it('should create new Todo', (done) => {
    request.post('/api/v1/todo')
      .send({
        text: 'NewTOdo'
      })
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        todoId = res.body.todo._id;
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.todo).to.be.an('object');
        expect(res.body.todo).to.have.property('text');
        return done();
      });
  });
  it('should validate text input', (done) => {
    request.post('/api/v1/todo')
      .send()
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('text is required');
        return done();
      });
  });
  it('should retrieve all todos', (done) => {
    request.get('/api/v1/todo')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body).to.have.property('newTodo');
        expect(res.body.newTodo).to.be.an('array');
        expect(res.body.newTodo[0].text).to.equal('NewTOdo');
        return done();
      });
  });

  it('should add tasks to todo', (done) => {
    request.post(`/api/v1/todos/${todoId}/task`)
      .send({
        text: 'myTask'
      })
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        taskId = res.body.task._id;
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('task');
        expect(res.body.success).to.equal(true);
        return done();
      });
  });
  it('should retrieve all tasks that belong to todo', (done) => {
    request.get(`/api/v1/todos/${todoId}/task`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.tasks).to.be.an('array');
        expect(res.body.tasks[0].text).to.equal('myTask');
        return done();
      });
  });
  it('should not retrieve tasks if the todoId is incorrect', (done) => {
    request.get('/api/v1/todos/1/task')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('Todo does not exist');
        return done();
      });
  });
  it('should not add task if Todo doesnot exist', (done) => {
    request.post('/api/v1/todos/1/task')
      .send({
        text: 'myTask'
      })
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('Todo does not exist');
        expect(res.body.success).to.equal(false);
        return done();
      });
  });
  it('should vadidate text input', (done) => {
    request.post(`/api/v1/todos/${todoId}/task`)
      .send()
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('text is required');
        return done();
      });
  });
  it('should add collaborators to Todo', (done) => {
    request.post(`/api/v1/todos/${todoId}/collaborator`)
      .send(['kool4life'])
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Collaborator have be successfully added');
        return done();
      });
  });
  it('should retrieve all collaborators in Todo', (done) => {
    request.get(`/api/v1/todos/${todoId}/collaborator`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.collaborators).to.be.an('array');
        expect(res.body.collaborators[0]).to.have.property('username');
        return done();
      });
  });
  it('should update a task ', (done) => {
    request.put(`/api/v1/todos/${todoId}/task/${taskId}`)
      .send({
        text: 'go to get goceries',
      })
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.editedTask).to.be.an('object');
        expect(res.body.editedTask).to.have.property('text');
        return done();
      });
  });
  it('should delete a task', (done) => {
    request.delete(`/api/v1/todos/${todoId}/task/${taskId}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Successfully deleted');
        return done();
      });
  });
});


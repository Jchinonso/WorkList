import TodosController from '../controllers/TodoController';
import Auth from '../middleware/Auth';

const TodosRoutes = (router) => {
  router.route('/todo')
    .post(Auth.verifyToken, TodosController.createTodos)
    .get(Auth.verifyToken, TodosController.retrieveAllTodos);
  router.route('/todos/:todoId/task')
    .post(Auth.verifyToken, TodosController.addTask)
    .get(Auth.verifyToken, TodosController.retrieveAllTasks);
  router.route('/todos/task/:taskId')
    .put(Auth.verifyToken, TodosController.updateTask)
    .delete(Auth.verifyToken, TodosController.deleteTask);
  router.route('/todos/:todoId/collaborator')
    .post(Auth.verifyToken, TodosController.addColaborator);
};

export default TodosRoutes;

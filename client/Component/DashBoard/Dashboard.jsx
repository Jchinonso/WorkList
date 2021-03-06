import React from 'react';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { connect } from 'react-redux';

import NavComponent from './NavComponent/Index.jsx';
import SideBarComponent from './SideBarComponent/Index.jsx';
import MainComponent from './MainComponent/Index.jsx';
import EditProfileComponent from './EditProfileComonent/Index.jsx';
import CreateTodoModal from './SideBarComponent/CreateTodoModal.jsx';
import { fetchTasks } from '../../actions/tasksActions';
import { selectTodo, createTodo } from '../../actions/todosActions';
import { fetchCollaborators } from '../../actions/collaboratorsAction';
import { signOut } from '../../actions/authActions';


/**
 * @class Dashboard
 * @extends React.Component
 */
class Dashboard extends React.Component {
  /**
 * @constructor
 * @extends React.Component
 * @param {object} props
 */
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleChangeTodo = this.handleChangeTodo.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidMount() {
    $(document).ready(() => {
      $('.dropdown-button').dropdown();
      $('.modal').modal();
      $('.tooltipped').tooltip({ delay: 50 });
      $('.button-collapse').sideNav({
        menuWidth: 250
      });
    });
  }
  /**
   * Handle onChange events on form inputs
   *
   * @method handleInputChange
   *
   * @member Dashboard
   *
   * @param {object} event
   *
   * @returns {function} a function that handles change event on inputs
   */
  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  /**
   * Method that handles onClick event on inputs
   *
   * @method handleOnClick
   *
   * @member Dashboard
   *
   * @param {object} event
   *
   * @returns {function} dispatches createTodo action
   */
  handleOnClick(event) {
    event.preventDefault();
    const { text } = this.state;
    if (text !== undefined) {
      const newText = text.trim();
      if (newText.length === 0) {
        return toastr.error('Todo Credentials must be supplied');
      }
      this.props.createTodo(newText)
        .then(() => {
          this.setState({ text: '' }, () => {
          });
        });
    }
  }
  /**
  * method that set todo to active
  *
  * @method handleChangeTodo
  *
  * @member Dashboard
  *
  * @param {object} todoId
  *
  * @returns {function} a function that
  * changes todo and dispatches some actions
  */
  handleChangeTodo(todoId) {
    this.props.selectTodo((todoId));
    this.props.fetchTasks(todoId);
    this.props.fetchCollaborators(todoId);
  }

  /**
   * Handle signout event
   *
   * @method handleOnChange
   *
   * @member Dashboard
   *
   * @param {object} event
   *
   * @returns {function} a function that dispatch signOut action
   */
  handleSignOut(event) {
    event.preventDefault();
    this.props.signOut();
  }

  /**
   * render component
   *
   * @method render
   *
   * @member Dashbaord
   *
   * @returns {object} component
   */
  render() {
    const { name, description } = this.state;
    return (
      <div>
        <header>
          <NavComponent signOut={this.handleSignOut} />
          <SideBarComponent handleChangeTodo={this.handleChangeTodo} />
        </header>
        <CreateTodoModal
          handleOnChange={this.handleOnChange}
          handleOnClick={this.handleOnClick}
          text={this.state.text}
        />
        <EditProfileComponent />
        <MainComponent />
      </div>
    );
  }
}

Dashboard.propTypes = {
  signOut: PropTypes.func.isRequired,
  selectTodo: PropTypes.func.isRequired,
  fetchTasks: PropTypes.func.isRequired,
  fetchCollaborators: PropTypes.func.isRequired,
  createTodo: PropTypes.func.isRequired,
};

export default connect(
  null, {
    signOut,
    fetchTasks,
    fetchCollaborators,
    selectTodo,
    createTodo
  }
)(Dashboard);

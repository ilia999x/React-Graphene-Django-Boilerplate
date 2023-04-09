import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";

import { UserContext } from "./../../Root";
import { GET_TODOS_QUERY } from "../../pages/App";

const DeleteTodo = ({ todo }) => {
  const currentUser = useContext(UserContext);
  const isCurrentUser = currentUser.id === todo.postedBy.id;

  const handleUpdateCache = (cache, { data: { deleteTodo } }) => {
    const data = cache.readQuery({ query: GET_TODOS_QUERY });
    const index = data.todos.findIndex(
      todo => Number(todo.id) === deleteTodo.todoId
    );
    // data.todos.splice(index, 1)
    const todos = [
      ...data.todos.slice(0, index),
      ...data.todos.slice(index + 1)
    ];
    cache.writeQuery({ query: GET_TODOS_QUERY, data: { todos } });
  };

  return (
    isCurrentUser && (
      <Mutation
        mutation={DELETE_TODO_MUTATION}
        variables={{ todoId: parseInt(todo.id) }}
        onCompleted={data => {
          console.log({ data });
        }}
        update={handleUpdateCache}
        // refetchQueries={() => [{ query: GET_TODOS_QUERY }]}
      >
        {deleteTodo => (
          <IconButton onClick={deleteTodo}>
            <TrashIcon />
          </IconButton>
        )}
      </Mutation>
    )
  );
};

const DELETE_TODO_MUTATION = gql`
  mutation($todoId: Int!) {
    deleteTodo(todoId: $todoId) {
      todoId
    }
  }
`;

export default DeleteTodo;

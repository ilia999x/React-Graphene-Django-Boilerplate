import React, { useState } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import SearchTodos from "../components/Todo/SearchTodos";
import TodoList from "../components/Todo/TodoList";
import CreateTodo from "../components/Todo/CreateTodo";
import Loading from "../components/common/Loading";
import Error from "../components/common/Error";

const App = ({ classes }) => {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div className={classes.container}>
      <SearchTodos setSearchResults={setSearchResults} />
      {/* create to do button , sends data to server */}
      <CreateTodo />
      <Query query={GET_TODOS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />;
          if (error) return <Error error={error} />;
          const todos = searchResults.length > 0 ? searchResults : data.todos;
          return <TodoList todos={todos} />;
        }}
      </Query>
    </div>
  );
};

export const GET_TODOS_QUERY = gql`
  query getTodosQuery {
    todos {
      id
      title
      description
      actions {
        id
      }
      postedBy {
        id
        username
      }
    }
  }
`;

const styles = theme => ({
  container: {
    // backgroundColor:'#eae6f0',
    margin: "0 auto",
    maxWidth: 960,
    padding: theme.spacing(2)
  }
});

export default withStyles(styles)(App);

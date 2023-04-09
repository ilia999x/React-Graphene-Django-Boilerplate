import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import { GET_TODOS_QUERY } from "../../pages/App";
import Error from "../common/Error";

const CreateTodo = ({ classes }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateCache = (cache, { data: { createTodo } }) => {
    const data = cache.readQuery({ query: GET_TODOS_QUERY });
    const todos = data.todos.concat(createTodo.todos);
    cache.writeQuery({ query: GET_TODOS_QUERY, data: { todos } });
  };

  const handleSubmit = async (event, createTodo) => {
    event.preventDefault();
    setSubmitting(true);
    createTodo({ variables: { title, description} });
  };

  return (
    <>
      {/* Create Todo Button */}
      <Button
        onClick={() => setOpen(true)}
        variant="fab"
        className={classes.fab}
        color="secondary"
      >
        {open ? <ClearIcon /> : <AddIcon />}
      </Button>

      {/* Create Todo Dialog */}
      <Mutation
        mutation={CREATE_TODO_MUTATION}
        onCompleted={data => {
          setSubmitting(false);
          setOpen(false);
          setTitle("");
          setDescription("");
        }}
        update={handleUpdateCache}
        // refetchQueries={() => [{ query: GET_TODOS_QUERY }]}
      >
        {(createTodo, { loading, error }) => {
         
          if (error) return <Error error={error} />;

          return (
            <Dialog open={open} className={classes.dialog}>
              <form onSubmit={event => handleSubmit(event, createTodo)}>
                <DialogTitle>Create Todo</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add a Title, Description of todos
                  </DialogContentText>
                  <FormControl fullWidth>
                    <TextField
                      label="Title"
                      placeholder="Add Title"
                      onChange={event => setTitle(event.target.value)}
                      value={title}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      multiline
                      label="Description"
                      placeholder="Add Description"
                      onChange={event => setDescription(event.target.value)}
                      value={description}
                      className={classes.textField}
                    />
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={submitting}
                    onClick={() => setOpen(false)}
                    className={classes.cancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      submitting ||
                      !title.trim() ||
                      !description.trim() 
                    }
                    type="submit"
                    className={classes.save}
                  >
                    {submitting ? (
                      <CircularProgress className={classes.save} size={24} />
                    ) : (
                      "Add Todo"
                    )}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          );
        }}
      </Mutation>
    </>
  );
};

const CREATE_TODO_MUTATION = gql`
  mutation($title: String!, $description: String!) {
    createTodo(title: $title, description: $description) {
      todo {
        id
        title
        description
        # actions {
        #   id
        # }
        postedBy {
          id
          username
        }
      }
    }
  }
`;

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing
  },
  cancel: {
    color: "red"
  },
  save: {
    color: "green"
  },
  button: {
    margin: theme.spacing(2)
  },
  icon: {
    marginLeft: theme.spacing
  },
  input: {
    display: "none"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: "200"
  }
});

export default withStyles(styles)(CreateTodo);

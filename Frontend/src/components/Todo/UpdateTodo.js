import React, { useState, useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import FormControl from "@material-ui/core/FormControl";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { UserContext } from "./../../Root";
import Error from "../common/Error";

const UpdateTodo = ({ classes, todo }) => {
  const currentUser = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [submitting, setSubmitting] = useState(false);
  const isCurrentUser = currentUser.id === todo.postedBy.id;

  const handleSubmit = async (event, updateTodo) => {
    event.preventDefault();
    setSubmitting(true);
    updateTodo({
      variables: { todoId: parseInt(todo.id), title, description,  }
    });
  };

  return (
    isCurrentUser && (
      <>
        {/* Update Todo Button */}
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
        {/* Update Todo Dialog */}
        <Mutation
          mutation={UPDATE_TODO_MUTATION}
          onCompleted={data => {
            setSubmitting(false);
            setOpen(false);
            setTitle("");
            setDescription("");
          }}
        >
          {(updateTodo, { loading, error }) => {
            if (error) return <Error error={error} />;
  
            return (
              <Dialog open={open} className={classes.dialog}>
                <form onSubmit={event => handleSubmit(event, updateTodo)}>
                  <DialogTitle>Update Todo</DialogTitle>
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
                        "Update Todo"
                      )}
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            );
          }}
        </Mutation>
      </>
    )
  );
};

const UPDATE_TODO_MUTATION = gql`
  mutation($todoId: Int!, $title: String, $description: String) {
    updateTodo(
      todoId: $todoId
      title: $title
      description: $description
    ) {
      todo {
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
  }
});

export default withStyles(styles)(UpdateTodo);

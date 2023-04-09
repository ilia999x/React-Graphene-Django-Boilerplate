import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from '@material-ui/icons/Send';
import { UserContext ,ME_QUERY} from "./../../Root";

const ActionTodo = ({ classes, todoId, actionCount }) => {
  const currentUser = useContext(UserContext);
  const handleDisableActionTodo = () => {
    const userActions = currentUser.actionSet;
    const isTodoAction =
      userActions.findIndex(({ todo }) => todo.id === todoId) > -1;
    return isTodoAction;
  };

  return (
    <Mutation
      mutation={CREATE_ACTION_MUTATION}
      variables={{ todoId }}
      onCompleted={data => {
        console.log({ data });
      }}
      refetchQueries={() => [{ query: ME_QUERY }]}
    >
      {actionTodo => (
        <IconButton
          onClick={event => {
            event.stopPropagation();
            actionTodo();
          }}
          className={classes.iconButton}
          disabled={handleDisableActionTodo()}
        >
          {actionCount}
          <SendIcon className={classes.icon} />
        </IconButton>
      )}
    </Mutation>
  );
};

const CREATE_ACTION_MUTATION = gql`
  mutation($todoId: Int!) {
    actionTodo(todoId: $todoId) {
      todo {
        id
        actions {
          id
        }
      }
    }
  }
`;

const styles = theme => ({
  iconButton: {
    color: "deeppink"
  },
  icon: {
    marginLeft: theme.spacing / 2
  }
});

export default withStyles(styles)(ActionTodo);

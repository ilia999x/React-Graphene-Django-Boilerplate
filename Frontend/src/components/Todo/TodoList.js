import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { Accordion } from '@material-ui/core';
import { AccordionDetails } from '@material-ui/core';
import { AccordionSummary } from '@material-ui/core';
import { AccordionActions } from '@material-ui/core';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import ActionTodo from "./ActionTodo";
import DeleteTodo from "./DeleteTodo";
import UpdateTodo from "./UpdateTodo";

const TodoList = ({ classes, todos }) => (
  <List>
    {todos.map(todo => (
      <Accordion key={todo.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItem className={classes.root}>
            <ActionTodo todoId={parseInt(todo.id)} actionCount={todo.actions.length} />
            <ListItemText
              primaryTypographyProps={{
                variant: "subtitle1",
                color: "primary"
              }}
              primary={todo.title}
              secondary={
                <Link
                  className={classes.link}
                  to={`/profile/${todo.postedBy.id}`}
                >
                  {todo.postedBy.username}
                </Link>
              }
            />
          </ListItem>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography variant="h4">{todo.description}</Typography>
        </AccordionDetails>
        <AccordionActions>
          <UpdateTodo todo={todo} />
          <DeleteTodo todo={todo} />
        </AccordionActions>
      </Accordion>
    ))}
  </List>
);

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  details: {
    alignItems: "center"
  },
  link: {
    color: "#424242",
    textDecoration: "none",
    "&:hover": {
      color: "black"
    }
  }
};

export default withStyles(styles)(TodoList);

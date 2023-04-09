import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Signout from "../Auth/Signout";

const Header = ({ classes, currentUser }) => {
  return (
    <>
    <AppBar position="static" className={classes.root}>
      <Toolbar className={classes.bar}>
        {/* Title / Logo */}
        <Link to="/" className={classes.grow}>
          <FavoriteIcon className={classes.logo} color="secondary" />
          <Typography variant="subtitle1" color="secondary" noWrap>
            ReactTodos
          </Typography>
        </Link>

        {/* Auth User Info */}
        {currentUser && (
          <Link to={`/profile/${currentUser.id}`} className={classes.grow}>
            <AccountCircleIcon className={classes.AccountCircle} />
            <Typography variant="subtitle1" className={classes.username} noWrap>
              {currentUser.username}
            </Typography>

          </Link>
        )}

        {/* Signout Button */}
        <Signout />
      </Toolbar>
    </AppBar>
    </>
  );
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 0,
    padding: 0,
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  logo: {
    marginRight: theme.spacing,
    fontSize: 45
  },
  AccountCircle: {
    marginRight: theme.spacing,
    fontSize: 30,
    color: "white"
  },
  username: {
    color: "white",
    fontSize: 30
  },
  bar: {
    backgroundColor: "#294858ff",
    fontSize: 30
  }
});

export default withStyles(styles)(Header);

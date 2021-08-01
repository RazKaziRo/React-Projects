import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import {Link} from 'react-router-dom';

//Redux
import { connect } from "react-redux";

//MUI
import Button from "@material-ui/core/Button";
import MuiLink from '@material-ui/core/link';

//Icons

const styles = {};

export class Profile extends Component {
  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, email },
        loading,
      },
    } = this.props;

    let profileMarkup = !loading ?  (authenticated ? (
       <Paper className={classes.paper}>
           <div className={classes.profile}>
               <div className="profile-image">
                    <img src={imageUrl} alt="profile"/>
               </div>
               <hr/>
               <div className="profile-details">
                <MuiLink component={link} to={`/users/${handle}`} color="primary" variant="h5">
                    @{handle}
                </MuiLink>
                <hr/>
                
               </div>
           </div>
       </Paper>
    ) : () ) : (<p>Loading...</p>)
    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(Profile));

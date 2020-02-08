import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';

import InfoIcon from '@material-ui/icons/Info';
import LinkIcon from '@material-ui/icons/Link';
import TransformIcon from '@material-ui/icons/Transform';
import {
    //BrowserRouter as Router,
    //Link,
    NavLink
} from "react-router-dom";

//import { connect } from 'react-redux';

const AppMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

function CustomizedMenus(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    //console.log("selectedItem:" + props.selectedItem);
    console.log("CustomizedMenus -> locale: " + props.activeLanguage);
    return (

        <div>
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClick}
            >
                <MenuIcon/>
            </Button>
            <AppMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <StyledMenuItem
                    selected={props.selectedItem === "/"}
                >
                    <NavLink to="/">
                        <ListItemIcon>
                            <TransformIcon fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary="Shorten"/>
                    </NavLink>
                </StyledMenuItem>
                <Divider/>
                <StyledMenuItem
                    selected={props.selectedItem === "/links"}
                >
                    <NavLink to="/links">
                        <ListItemIcon>
                            <LinkIcon fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary="Links"/>
                    </NavLink>
                </StyledMenuItem>
                <Divider/>
                <StyledMenuItem
                    selected={props.selectedItem === "/about"}
                >
                    <NavLink to="/about">
                        <ListItemIcon>
                            <InfoIcon fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary="About"/>
                    </NavLink>
                </StyledMenuItem>
            </AppMenu>
        </div>

    );
}

export default CustomizedMenus;
//export default withLocalize(CustomizedMenus);
/*
function mapStateToProps(state) {
    const {changeLocale} = state;
    console.log("AppMenu.mapStateToProps -> " + JSON.stringify(changeLocale));
    
    return {
        locale: changeLocale['locale']
    };
}
export default connect(mapStateToProps)(CustomizedMenus);
*/
//

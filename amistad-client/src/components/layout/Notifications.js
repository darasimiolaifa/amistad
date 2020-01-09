import React, { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import NotificationIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
import { markNotificationsAsRead } from "../../redux/actions/userActions";

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => ({ ...state.user }));
  const filteredNotifications = notifications.filter(notification => notification.sender !== notification.receipient);
  let iconNotification;
  if (filteredNotifications && filteredNotifications.length > 0) {
    const unreadNotifications = filteredNotifications.filter(
      notification => notification.read === false
    ).length;
    unreadNotifications > 0
      ? (iconNotification = (
          <Badge badgeContent={unreadNotifications} color="secondary">
            <NotificationIcon />
          </Badge>
        ))
      : (iconNotification = <NotificationIcon />);
  } else iconNotification = <NotificationIcon />;

  dayjs.extend(RelativeTime);

  const handleOpen = ({ target }) => {
    setAnchorEl(target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpened = () => {
    const unreadNotifications = filteredNotifications
      .filter(notification => !notification.read)
      .map(notification => notification.notificationId);
    markNotificationsAsRead(dispatch, { notificationIds: unreadNotifications });
  };

  let notificationsMarkup =
    filteredNotifications && filteredNotifications.length > 0 ? (
      filteredNotifications.map(notification => {
        const verb = notification.type === "like" ? "liked" : "commented on";
        const time = dayjs(notification.createdAt).fromNow();
        const iconColor = notification.read ? "primary" : "secondary";
        const iconType =
          notification.type === "like" ? (
            <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
          ) : (
            <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
          );
        return (
          <MenuItem onClick={handleClose} key={notification.createdAt}>
            {iconType}
            <Typography
              variant="body1"
              color="textSecondary"
              component={Link}
              to={`/user/${notification.receipient}/screams/${notification.screamId}`}
            >
              {notification.sender} {verb} your scream {time}
            </Typography>
          </MenuItem>
        );
      })
    ) : (
      <MenuItem onClick={handleClose}> You have no notifications yet</MenuItem>
    );
  return (
    <Fragment>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          aria-owns={anchorEl ? "single-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {iconNotification}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onEntered={handleMenuOpened}
      >
        {notificationsMarkup}
      </Menu>
    </Fragment>
  );
};

export default Notifications;

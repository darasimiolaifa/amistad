import React from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { Link } from "react-router-dom";
import MyButton from "../../util/myButton";
import { likeScream, unlikeScream } from "../../redux/actions/dataActions";
import { useSelector, useDispatch } from "react-redux";

const LikeButton = ({ screamId }) => {
  const { likes, authenticated } = useSelector(state => ({ ...state.user }));

  const dispatch = useDispatch();
  // check if logged in user likes this scream
  const likedScream =
    likes && likes.find(like => like.screamId === screamId) ? true : false;

  const doLikeScream = () => likeScream(dispatch, screamId);
  const doUnlikeScream = () => unlikeScream(dispatch, screamId);

  const likeButton = !authenticated ? (
    <Link to="/login">
      <MyButton tip="Like">
        <FavoriteBorder color="primary" />
      </MyButton>
    </Link>
  ) : !likedScream ? (
    <MyButton tip="Like" onClick={doLikeScream}>
      <FavoriteBorder color="primary" />
    </MyButton>
  ) : (
    <MyButton tip="Unlike" onClick={doUnlikeScream}>
      <FavoriteIcon color="primary" />
    </MyButton>
  );
  return likeButton;
};

export default LikeButton;

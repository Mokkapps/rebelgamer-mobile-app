import Snackbar from 'react-native-snackbar';
import { Alert } from 'react-native';
import translate from '../translate';
import { POSTS_PER_PAGE, WP_BASE_URL } from '../constants';

export const getPostList = (oldPosts, newPosts, page) => {
  let posts = newPosts;

  if (page > 1) {
    posts = removeDuplicates([...oldPosts, ...newPosts], 'id');
  }

  return posts;
};

export const showToast = message => {
  Snackbar.show({
    text: message,
    duration: Snackbar.SHORT,
  });
};

export const showErrorAlert = (error: string): void => {
  Alert.alert(
    translate('ALERT_TITLE'),
    `${translate('ALERT_MESSAGE')} ${error}`,
    [
      {
        text: translate('OK'),
        style: 'cancel',
      },
    ],
    { cancelable: false },
  );
  console.error(error);
};

export const getWordpressUrl = (page: number, search: string) => {
  return `${WP_BASE_URL}posts?_embed=true&page=${page}&per_page=${POSTS_PER_PAGE}&search=${search}&dt=${new Date().getTime()}`;
};

const removeDuplicates = (myArr, prop) => {
  return myArr.filter(
    (obj, pos, arr) =>
      arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos,
  );
};

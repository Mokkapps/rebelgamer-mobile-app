import axios from 'axios';
import { Post } from './wp-types';

const WP_BASE_URL = 'https://www.rebelgamer.de/wp-json/wp/v2/';
const POSTS_PER_PAGE = 5;

export default function fetchPosts(
  page: number,
  search: string,
  cancelToken
): Promise<typeof Post[]> {
  return axios
    .get(
      `${WP_BASE_URL}posts?_embed=true&page=${page}&per_page=${POSTS_PER_PAGE}&search=${search}&dt=${new Date().getTime()}`,
      { cancelToken }
    )
    .then(response => {
      return response.data;
    })
    .catch(thrown => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      }
    });
}

import { Post } from '../wp-types';

const WP_BASE_URL = 'https://www.rebelgamer.de/wp-json/wp/v2/';
const POSTS_PER_PAGE = 5;

export default function fetchPosts(page: number, search: string): Promise<typeof Post[]> {
  return fetch(`${WP_BASE_URL}posts?_embed=true&page=${page}&per_page=${POSTS_PER_PAGE}&search=${search}`).then(
    response => {
      try {
        return response.json();
      } catch (e) {
        throw new Error(`Failed parsing JSON: ${e}`);
      }
    }
  );
}

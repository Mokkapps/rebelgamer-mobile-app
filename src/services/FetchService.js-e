// @flow

import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';

import Post from './../Types';

const WP_BASE_URL = 'https://www.rebelgamer.de/wp-json/wp/v2/';
const POSTS_PER_PAGE = 5;

class FetchService {
  getPosts(page: number, search: string): Observable<Post[]> {
    const request = fetch(
      `${WP_BASE_URL}posts?_embed=true&page=${page}&per_page=${POSTS_PER_PAGE}&search=${search}`
    ).then(response => response.json());

    return Observable.from(request);
  }
}

export default new FetchService();

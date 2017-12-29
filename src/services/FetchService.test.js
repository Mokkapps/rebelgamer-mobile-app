import FetchService from './FetchService';

it('should correctly fetch posts', (done) => {
  const testPosts = { posts: '12345' };
  fetch.mockResponse(JSON.stringify(testPosts));

  return FetchService.getPosts(1, '').subscribe((posts) => {
    expect(posts).toEqual(testPosts);
    done();
  });
});

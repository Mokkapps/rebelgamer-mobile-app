// @flow
// Based on https://github.com/joehoyle/WP-REST-API-to-Flow-Types

declare type Post = {
  date: string,
  date_gmt: string,
  guid: {
    raw?: string,
    rendered: string
  },
  id: number,
  link: string,
  modified: string,
  modified_gmt: string,
  slug: string,
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private',
  type: string,
  password?: string,
  title: {
    raw?: string,
    rendered: string
  },
  content: {
    raw?: string,
    rendered: string,
    protected: boolean
  },
  author: number,
  excerpt: {
    raw?: string,
    rendered: string,
    protected: boolean
  },
  featured_media: number,
  comment_status: 'open' | 'closed',
  ping_status: 'open' | 'closed',
  format:
    | 'standard'
    | 'aside'
    | 'chat'
    | 'gallery'
    | 'link'
    | 'image'
    | 'quote'
    | 'status'
    | 'video'
    | 'audio',
  meta: Object,
  sticky: boolean,
  template: string,
  categories: Array<number>,
  tags: Array<number>,
  _embedded: Embedded
};

declare type PostRevision = {
  author: number,
  date: string,
  date_gmt: string,
  guid: {
    raw?: string,
    rendered: string
  },
  id: number,
  modified: string,
  modified_gmt: string,
  parent: number,
  slug: string,
  title: {
    raw?: string,
    rendered: string
  },
  content: {
    raw?: string,
    rendered: string,
    protected: boolean
  },
  excerpt: {
    raw?: string,
    rendered: string,
    protected: boolean
  }
};

declare type Page = {
  date: string,
  date_gmt: string,
  guid: {
    raw?: string,
    rendered: string
  },
  id: number,
  link: string,
  modified: string,
  modified_gmt: string,
  slug: string,
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private',
  type: string,
  password?: string,
  parent: number,
  title: {
    raw?: string,
    rendered: string
  },
  content: {
    raw?: string,
    rendered: string,
    protected: boolean
  },
  author: number,
  excerpt: {
    raw?: string,
    rendered: string,
    protected: boolean
  },
  featured_media: number,
  comment_status: 'open' | 'closed',
  ping_status: 'open' | 'closed',
  menu_order: number,
  meta: Object,
  template: string
};

declare type PageRevision = {
  author: number,
  date: string,
  date_gmt: string,
  guid: {
    raw?: string,
    rendered: string
  },
  id: number,
  modified: string,
  modified_gmt: string,
  parent: number,
  slug: string,
  title: {
    raw?: string,
    rendered: string
  },
  content: {
    raw?: string,
    rendered: string,
    protected: boolean
  },
  excerpt: {
    raw?: string,
    rendered: string,
    protected: boolean
  }
};

declare type Attachment = {
  date: string,
  date_gmt: string,
  guid: {
    raw?: string,
    rendered: string
  },
  id: number,
  link: string,
  modified: string,
  modified_gmt: string,
  slug: string,
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private',
  type: string,
  title: {
    raw?: string,
    rendered: string
  },
  author: number,
  comment_status: 'open' | 'closed',
  ping_status: 'open' | 'closed',
  meta: Object,
  template: string,
  alt_text: string,
  caption: {
    raw?: string,
    rendered: string
  },
  description: {
    raw?: string,
    rendered: string
  },
  media_type: 'image' | 'file',
  mime_type: string,
  media_details: Object,
  post: number,
  source_url: string
};

declare type Type = {
  capabilities?: Object,
  description: string,
  hierarchical: boolean,
  labels?: Object,
  name: string,
  slug: string,
  supports?: Object,
  taxonomies: Array<string>,
  rest_base: string
};

declare type Status = {
  name: string,
  private?: boolean,
  protected?: boolean,
  public: boolean,
  queryable: boolean,
  show_in_list?: boolean,
  slug: string
};

declare type Taxonomy = {
  capabilities?: Object,
  description: string,
  hierarchical: boolean,
  labels?: Object,
  name: string,
  slug: string,
  show_cloud?: boolean,
  types: Array<string>,
  rest_base: string
};

declare type Category = {
  id: number,
  count: number,
  description: string,
  link: string,
  name: string,
  slug: string,
  taxonomy:
    | 'category'
    | 'post_tag'
    | 'nav_menu'
    | 'link_category'
    | 'post_format',
  parent: number,
  meta: Object
};

declare type Tag = {
  id: number,
  count: number,
  description: string,
  link: string,
  name: string,
  slug: string,
  taxonomy:
    | 'category'
    | 'post_tag'
    | 'nav_menu'
    | 'link_category'
    | 'post_format',
  meta: Object
};

declare type User = {
  id: number,
  username?: string,
  name: string,
  first_name?: string,
  last_name?: string,
  email?: string,
  url: string,
  description: string,
  link: string,
  locale?: '' | 'en_US',
  nickname?: string,
  slug: string,
  registered_date?: string,
  roles?: Array<string>,
  password?: string,
  capabilities?: Object,
  extra_capabilities?: Object,
  avatar_urls: {
    '24': string,
    '48': string,
    '96': string
  },
  meta: Object
};

declare type Comment = {
  id: number,
  author: number,
  author_email?: string,
  author_ip?: string,
  author_name: string,
  author_url: string,
  author_user_agent?: string,
  content: {
    raw?: string,
    rendered: string
  },
  date: string,
  date_gmt: string,
  link: string,
  parent: number,
  post: number,
  status: string,
  type: string,
  author_avatar_urls: {
    '24': string,
    '48': string,
    '96': string
  },
  meta: Object
};

declare type Settings = {
  title: string,
  description: string,
  timezone: string,
  date_format: string,
  time_format: string,
  start_of_week: number,
  language: string,
  use_smilies: boolean,
  default_category: number,
  default_post_format: string,
  posts_per_page: number,
  default_ping_status: 'open' | 'closed',
  default_comment_status: 'open' | 'closed',
  permalink_structure: string
};

declare type Embedded = {
  'wp:featuredmedia': Array<Media>,
  author: Array<Author>
};

declare type Media = {
  source_url: string
};

declare type Author = {
  name: string
};

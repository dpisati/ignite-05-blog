import * as prismic from '@prismicio/client';

export const repositoryName = 'ignite-05-blog';
const endpoint = prismic.getEndpoint(repositoryName);

export const prismicClient = prismic.createClient(endpoint);

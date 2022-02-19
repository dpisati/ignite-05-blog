import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';

import Client from '../services/prismicHelpers';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleNextPage = async () => {
    let response;

    if (!nextPage) {
      response = await fetch(postsPagination.next_page);
    } else {
      response = await fetch(nextPage);
    }

    const data: PostPagination = await response.json();

    const newPosts = posts.concat(data.results);
    const newNextPage = data.next_page;

    setPosts(newPosts);
    setNextPage(newNextPage);
  };

  return (
    <>
      <Header />

      {posts.map(post => (
        <article key={post.uid} className={styles.postsContainer}>
          <h1>{post.data.title}</h1>
          <p>{post.data.subtitle}</p>
          <section>
            <div>
              <FiCalendar />
              <span style={{ textTransform: 'capitalize' }}>
                {format(new Date(post.first_publication_date), 'dd LLL yy', {
                  locale: ptBR,
                })}
              </span>
            </div>
            <div>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
          </section>
        </article>
      ))}

      {nextPage && (
        <button className={styles.button} onClick={handleNextPage}>
          Carregar mais posts
        </button>
      )}
    </>
  );
}

export const getStaticProps = async () => {
  const postsPagination = await Client().query(
    [Prismic.Predicates.at('document.type', 'posts')],
    { pageSize: 1 }
  );

  return {
    props: {
      postsPagination,
    },
  };
};

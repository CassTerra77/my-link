export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export const links: Link[] = [
  {
    id: '1',
    title: '인스타그램',
    url: 'https://www.instagram.com',
    icon: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=64',
  },
  {
    id: '2',
    title: '유튜브',
    url: 'https://www.youtube.com',
    icon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64',
  },
  {
    id: '3',
    title: '블로그',
    url: 'https://blog.naver.com',
    icon: 'https://www.google.com/s2/favicons?domain=naver.com&sz=64',
  },
  {
    id: '4',
    title: 'GitHub',
    url: 'https://github.com',
    icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=64',
  },
  {
    id: '5',
    title: '포트폴리오',
    url: 'https://portfolio.me',
    icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=64',
  },
];

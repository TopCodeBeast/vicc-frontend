export type Props = {
  provider: 'discord' | 'twitter' | 'google_oauth2' | 'facebook';
  children?: React.ReactNode;
}
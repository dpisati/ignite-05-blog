import Image from 'next/image';
import styles from './header.module.scss';
export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <Image src="/logo.svg" width={240} height={26} />
    </header>
  );
}

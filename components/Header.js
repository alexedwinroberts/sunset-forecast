import Link from "next/link";
import styles from "../styles/Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__iconcontainer}>
          <Link href="/">
            <img
              className={styles.header__icon}
              src="/sun_horizon_white.svg"
              alt="sunset"
            />
          </Link>
        </div>
        <div className={styles.header__links}>
          <Link className={styles.header__link} href="/">
            <a className={styles.header__text}>Forecast</a>
          </Link>
          <Link className={styles.header__link} href="/about">
            <a className={styles.header__text}>About</a>
          </Link>
        </div>
      </div>
    </header>
  );
};

export { Header };

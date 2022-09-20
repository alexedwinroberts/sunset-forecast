import Head from "next/head";
import { Header } from "./Header";
// import styles from '@/styles/Layout.module.css'

const Layout = ({
  title = "Vancouver Sunsets",
  keywords = "vancouver, sunset, sunrise ",
  description = "Get a forecast for the next sunset or sunrise in Vancouver",
  children,
}) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <Header />
      {/* <div className={styles.container}>{children}</div> */}
      {children}
    </div>
  );
};

export { Layout };

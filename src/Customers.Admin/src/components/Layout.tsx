import { Link, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Customer Admin</h1>
        <nav>
          <Link to="/">Customers</Link>
          <Link to="/new">New Customer</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

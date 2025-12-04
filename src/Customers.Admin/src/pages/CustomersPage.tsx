import { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { SearchBar } from '../components/SearchBar';
import { CustomerList } from '../components/CustomerList';
import { Pagination } from '../components/Pagination';
import styles from './CustomersPage.module.css';

const PAGE_SIZE = 50;

function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useCustomers({
    search: searchQuery,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customers</h1>
        <p className={styles.subtitle}>
          Search and view customer information
        </p>
      </div>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Search by name, email, or phone..."
      />

      {error && (
        <div className={styles.error}>
          Failed to load customers. Please try again.
        </div>
      )}

      <CustomerList customers={data?.items || []} isLoading={isLoading} />

      {data && (
        <Pagination
          currentPage={currentPage}
          totalCount={data.total}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default CustomersPage;

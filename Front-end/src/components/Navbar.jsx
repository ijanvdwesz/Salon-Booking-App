import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav style={styles.navbar}>
      {currentPath !== "/" && (
        <Link to="/" style={styles.link}>Home</Link>
      )}
      {currentPath !== "/booking" && (
        <Link to="/booking" style={styles.link}>Book Appointment</Link>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    padding: '1rem',
    backgroundColor: '#FFC0CB',
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem'
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  }
};

export default Navbar;

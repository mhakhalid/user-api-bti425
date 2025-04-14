import { Navbar, Nav, Form, Button, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../../store';
import { isAuthenticated, readToken, removeToken } from '@/lib/authenticate';
import { addToHistory } from '@/lib/userData';

export default function MainNav() {
  const router = useRouter();
  const [searchField, setSearchField] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    const token = readToken();
    setUserName(token?.userName || '');
  }, [router.pathname]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const queryString = `title=true&q=${searchField}`;
    const updatedHistory = await addToHistory(queryString);
    setSearchHistory(updatedHistory);
    router.push(`/artwork?${queryString}`);
    setIsExpanded(false);
  };

  const handleLinkClick = () => {
    setIsExpanded(false);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');
    removeToken();
    router.push('/login');
  };

  return (
    <>
      <Navbar className="navbar-custom fixed-top" expand="lg" expanded={isExpanded}>
        <Navbar.Brand className="text-white">Student Name: Muhammad Hamid Ali Khalid</Navbar.Brand>

        <Nav className="me-auto">
          <Link href="/" passHref legacyBehavior>
            <Nav.Link onClick={handleLinkClick} active={router.pathname === "/"}>
              Home
            </Nav.Link>
          </Link>
          {isLoggedIn && (
            <Link href="/search" passHref legacyBehavior>
              <Nav.Link onClick={handleLinkClick} active={router.pathname === "/search"}>
                Advanced Search
              </Nav.Link>
            </Link>
          )}
        </Nav>

        &nbsp;
        {isLoggedIn && (
          <Form className="d-flex" onSubmit={handleSearchSubmit}>
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="search-input"
            />
            <Button type="submit" className="search-button">Search</Button>
          </Form>
        )}
        &nbsp;

        <Nav>
          {isLoggedIn ? (
            <NavDropdown title={userName} id="user-nav-dropdown">
              <Link href="/favourites" passHref legacyBehavior>
                <NavDropdown.Item as="span" onClick={handleLinkClick} active={router.pathname === "/favourites"}>
                  Favourites
                </NavDropdown.Item>
              </Link>
              <Link href="/history" passHref legacyBehavior>
                <NavDropdown.Item as="span" onClick={handleLinkClick} active={router.pathname === "/history"}>
                  Search History
                </NavDropdown.Item>
              </Link>
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Link href="/register" passHref legacyBehavior>
                <Nav.Link onClick={handleLinkClick} active={router.pathname === "/register"}>
                  Register
                </Nav.Link>
              </Link>
              <Link href="/login" passHref legacyBehavior>
                <Nav.Link onClick={handleLinkClick} active={router.pathname === "/login"}>
                  Log In
                </Nav.Link>
              </Link>
            </>
          )}
        </Nav>

        <Navbar.Toggle onClick={handleToggle} />
      </Navbar>
      <br />
      <br />
    </>
  );
}

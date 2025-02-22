import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/repos">Repositories</Link></li>
          <li><Link to="/pipeline">Pipeline</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

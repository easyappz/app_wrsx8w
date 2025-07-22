import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/">Оценить фотографии</Link>
          </li>
          <li>
            <Link to="/upload">Загрузить фотографию</Link>
          </li>
          <li>
            <Link to="/my-photos">Мои фотографии</Link>
          </li>
          <li>
            <Link to="/profile">Профиль</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;

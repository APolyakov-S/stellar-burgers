import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { NavLink } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName, pathname }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <>
          <NavLink
            to='/'
            className={({ isActive }) =>
              clsx(
                'text text_type_main-default ml-2 mr-10',
                isActive ? 'text_color_primary' : 'text_color_inactive'
              )
            }
          >
            <BurgerIcon type={pathname === '/' ? 'primary' : 'secondary'} />
            <span className='ml-2'>Конструктор</span>
          </NavLink>
        </>
        <>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              clsx(
                'text text_type_main-default ml-2',
                isActive ? 'text_color_primary' : 'text_color_inactive'
              )
            }
          >
            <ListIcon type={pathname === '/feed' ? 'primary' : 'secondary'} />
            <span className='ml-2'>Лента заказов</span>
          </NavLink>
        </>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div className={styles.link_position_last}>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            clsx(
              'text text_type_main-default ml-2',
              isActive || pathname.startsWith('/profile')
                ? 'text_color_primary'
                : 'text_color_inactive'
            )
          }
        >
          <ProfileIcon
            type={pathname.startsWith('/profile') ? 'primary' : 'secondary'}
          />
          <span className='ml-2'>{userName || 'Личный кабинет'}</span>
        </NavLink>
      </div>
    </nav>
  </header>
);

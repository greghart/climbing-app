import * as React from 'react';
import User from '../../../models/User';
import { Omit } from 'utility-types';

interface Props {
  user: Omit<User, 'comments'>;
}

const colors = [
  ['bg-primary', 'text-white'],
  ['bg-secondary', 'text-white'],
  ['bg-success', 'text-white'],
  ['bg-danger', 'text-white'],
  ['bg-warning', 'text-dark'],
  ['bg-info', 'text-white'],
  ['bg-light','text-dark'],
  ['bg-dark', 'text-white'],
];
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
const getRandomColorClass = () => {
  return colors[getRandomInt(colors.length)].join(' ');
}

const ProfileIcon: React.SFC<Props> = (props) => {
  return (
    <div className={`rounded-circle profile-icon ${colors[props.user.id % colors.length].join(' ')}`}>
      {props.user.name[0]}
    </div>
  );
};

export default ProfileIcon;

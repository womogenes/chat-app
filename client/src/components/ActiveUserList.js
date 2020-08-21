import React from 'react';

const ActiveUserList = (props) => {
  const { activeUsers, self } = props;

  return (
    <>
      <h3>Active Users</h3>
      {
        activeUsers.map(user => {
          if (user.name === self.username && user.id === self.id) {
            return (
              <div className='active-user' key={user.id}>
                <p className='active-user-name-self'>{user.name}</p>
                <p>{user.id.substring(0, 6)}</p>
              </div>
            );
          } else {
            return (
              <div className='active-user' key={user.id}>
                <p className='active-user-name'>{user.name}</p>
                <p>{user.id.substring(0, 6)}</p>
              </div>
            );
          }
        })
      }
    </>
  );
};

export default ActiveUserList;
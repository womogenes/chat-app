import React from 'react';

const ActiveUserList = (props) => {
  const { activeUsers } = props;
  console.log(activeUsers);

  return (
    <>
      <h3>Active Users</h3>
      {
        activeUsers.map(user => {
          console.log(user.id);
          return (
            <div className='activeUser' key={user.id}>
              <p id={user.id}>{user.name}</p>
            </div>
          );
        })
      }
    </>
  );
};

export default ActiveUserList;
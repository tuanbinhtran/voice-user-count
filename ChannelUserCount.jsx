const { React, getModule } = require('powercord/webpack');

let classes;
setImmediate(async () => {
  classes = {
    ...(await getModule(['wrapper', 'users'], false)),
    ...(await getModule(['userLimit'], false)),
  };
});

const ChannelUserCount = ({ userCount }) => {
  if (!userCount) {
    return null;
  }

  return (
    <div className={classes.userLimit}>
      <div className={classes.wrapper}>
        <span
          className={classes.users}
          style={{ width: 'auto', padding: '0 6px' }}
        >
          {String(userCount).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

module.exports = React.memo(ChannelUserCount);
const { React, getModule } = require('powercord/webpack');

let classes;
setImmediate(async () => {
  classes = {
    ...(await getModule(['wrapper', 'users'])),
    ...(await getModule(['userLimit'])),
  };
});

class ChannelUserCount extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.userCount) return null;

    return (
      <div className={classes.userLimit}>
        <div className={classes.wrapper}>
          <span className={classes.users} style={{ width: 'auto' }}>
            {('00' + this.props.userCount).substr(-2, 2)}
          </span>
        </div>
      </div>
    );
  }
}

module.exports = ChannelUserCount;

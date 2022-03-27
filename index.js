const { Plugin } = require('powercord/entities');
const { getModule, React } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const ChannelUserCount = require('./ChannelUserCount.jsx');
const e = React.createElement;

class VoiceUserCount extends (
  Plugin
) {
  async startPlugin() {
    this.patchChannelItem();
  }

  pluginWillUnload() {
    uninject('voice-user-count');
  }

  async patchChannelItem() {
    const ConnectedVoiceChannel = await getModule(m => m.default && m.default.displayName === 'ChannelItem');

    const renderCount = (args, res) => {
      if(!this.shouldApply(args)) {
        return res;
      }

      const channelInfoElement = args[0].children[3];
      const children = React.Children.toArray(channelInfoElement.props.children);
      const ChannelUserCountElement = e(ChannelUserCount, { userCount: this.getUserCount(channelInfoElement)});

      children.push(ChannelUserCountElement);
      channelInfoElement.props.children = children;

      return res;
    };

    inject('voice-user-count', ConnectedVoiceChannel, 'default', renderCount);

    ConnectedVoiceChannel.default.displayName = 'ChannelItem';
  }

  shouldApply(args) {
    const channel = args[0].channel;
    const isVideo = args[0].children[0]?.props.video;
    const users = args[0].children[3]?.props.children?.props?.voiceStates?.length;

    return (
      channel.isGuildVoice() &&
      !channel.userLimit &&
      !isVideo &&
      users
    )
  }

  getUserCount(channelInfo) {
    return channelInfo.props.children?.props?.voiceStates?.length;
  }
};

module.exports = VoiceUserCount;
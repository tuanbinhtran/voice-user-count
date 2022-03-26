const { Plugin } = require('powercord/entities');
const { getModule, React } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const ChannelUserCount = require('./ChannelUserCount.jsx');

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

      const originalChildren = args[0].children[3].props.children;
      const userCount = originalChildren?.props?.voiceStates?.length;
      const ChannelUserCountElement = React.createElement(ChannelUserCount, {
        userCount,
      });

      args[0].children[3].props.children = [originalChildren, ChannelUserCountElement];

      return res;
    };

    inject('voice-user-count', ConnectedVoiceChannel, 'default', renderCount);

    ConnectedVoiceChannel.default.displayName = 'ChannelItem';
  }

  shouldApply(args) {
    const channel = args[0].channel;
    const isVideo = args[0].children[0]?.props.video;
    const users = args[0].children[3].props.children?.props?.voiceStates?.length;

    return (
      channel.isGuildVoice() &&
      !channel.userLimit &&
      !isVideo &&
      users
    )
  }
};

module.exports = VoiceUserCount;
const { Plugin } = require('powercord/entities');
const { getModule, React, getAllModules } = require('powercord/webpack');
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
    const { countVoiceStatesForChannel } = await getModule(['getVoiceStates']);
    const ConnectedVoiceChannel = await getModule(m => m.default && m.default.displayName === 'ChannelItem');

    const renderCount = (args, res) => {
      let channel = args[0].channel;

      if (!channel.isGuildVoice()) return res;
      if (channel.userLimit) return res;
      if (args[0].children[0]?.props.video) return res;

      const userCount = countVoiceStatesForChannel(channel.id);

      if (!userCount) return res;

      const ChannelUserCountElement = React.createElement(ChannelUserCount, {
        userCount,
      });

      args[0].children.push(ChannelUserCountElement);

      return res;
    };

    inject('voice-user-count', ConnectedVoiceChannel, 'default', renderCount);

    ConnectedVoiceChannel.default.displayName = 'ChannelItem';
  }
};

module.exports = VoiceUserCount;
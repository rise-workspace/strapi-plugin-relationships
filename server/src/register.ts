import type { Core } from '@strapi/strapi';
import { PLUGIN_ID, PLUGIN_NAME } from './pluginId';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: PLUGIN_NAME,
    plugin: PLUGIN_ID,
    type: 'string',
  });
};

export default register;

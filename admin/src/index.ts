import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID, PLUGIN_NAME } from './pluginId';
import { Initializer } from './components/Initializer';
import { OneToManyIcon } from './components/Icons/OneToMany';

export default {
  register(app: any) {
    app.customFields.register({
      name: PLUGIN_NAME,
      pluginId: PLUGIN_ID,
      type: 'string',
      icon: OneToManyIcon,
      intlLabel: {
        id: getTranslation('form.label'),
        defaultMessage: 'Relationships',
      },
      intlDescription: {
        id: getTranslation('form.description'),
        defaultMessage: 'Refers to several types of collections',
      },
      components: {
        Input: async () =>
          import('./components/Inputs/RelationshipsInput').then((module) => ({
            default: module.RelationshipsInput,
          })),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: getTranslation('options.section.relationSettings'),
              defaultMessage: 'Relation settings',
            },
            items: [
              {
                intlLabel: {
                  id: getTranslation('options.relationType.label'),
                  defaultMessage: 'Relation type',
                },
                name: 'options.relationType',
                type: 'select',
                required: true,
                defaultValue: 'oneToOne',
                options: [
                  {
                    key: 'oneToOne',
                    value: 'oneToOne',
                    metadatas: {
                      intlLabel: {
                        id: getTranslation('options.relationType.oneToOne'),
                        defaultMessage: 'One to One',
                      },
                    },
                  },
                  {
                    key: 'oneToMany',
                    value: 'oneToMany',
                    metadatas: {
                      intlLabel: {
                        id: getTranslation('options.relationType.oneToMany'),
                        defaultMessage: 'One to Many',
                      },
                    },
                  },
                  /**
                  {
                    key: 'manyToOne',
                    value: 'manyToOne',
                    metadatas: {
                      intlLabel: {
                        id: getTranslation('options.relationType.manyToOne'),
                        defaultMessage: 'Many to One',
                      },
                    },
                  },
                  {
                    key: 'manyToMany',
                    value: 'manyToMany',
                    metadatas: {
                      intlLabel: {
                        id: getTranslation('options.relationType.manyToMany'),
                        defaultMessage: 'Many to Many',
                      },
                    },
                  },
                  **/
                ],
              },
              {
                intlLabel: {
                  id: getTranslation('options.targetCollections.label'),
                  defaultMessage: 'Target collection UIDs (multiple)',
                },
                description: {
                  id: getTranslation('options.targetCollections.description'),
                  defaultMessage:
                    'Comma-separated UIDs. Ex: Tool,api::content.tool ; Article,api::article.article',
                },
                name: 'options.targetCollections',
                type: 'text',
                required: true,
                placeholder: {
                  id: getTranslation('options.targetCollections.placeholder'),
                  defaultMessage: 'uid1,uid2,uid3',
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'options.section.advancedSettings',
              defaultMessage: 'Advanced settings',
            },
            items: [
              {
                name: 'options.required',
                type: 'checkbox',
                intlLabel: {
                  id: 'options.required.label',
                  defaultMessage: 'Champ obligatoire',
                },
                description: {
                  id: 'options.required.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
                defaultValue: false,
              },
            ],
          },
        ],
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_NAME,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};

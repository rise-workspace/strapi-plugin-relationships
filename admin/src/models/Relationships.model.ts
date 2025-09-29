export type RelationshipModel = {
  value: string;
  label: string;
  status: string;
  isPublished: boolean;
  badgeTextColor: string;
  badgeBgColor: string;
};

export type RelationshipsModel = {
  idCollection: string;
  idRelation: string;
} & RelationshipModel;

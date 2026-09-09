export type CollaboratorView = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
};

export type CollaboratorsResponse = {
  isOwner: boolean;
  owner: CollaboratorView;
  collaborators: CollaboratorView[];
};

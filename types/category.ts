export type CategoryDTO = {
  id: string;
  name: string;
  color: string;
  isArchived: boolean;
};

export type CategoryInput = {
  name: string;
  color: string;
};

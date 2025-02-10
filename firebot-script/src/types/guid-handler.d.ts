export interface NewGuidProps {
  type: string;
  parentGuid?: string;
}

export interface NewGuidResponse {
  id: string;
  guid: string;
}

export interface ObjectFromGuidProps {
  guid: string;
}

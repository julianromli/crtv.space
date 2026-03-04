export type ViewerMode = 'logged_in' | 'logged_out';

export type ProfileLockMetadata = {
  sections: {
    portfolio: boolean;
    contact: boolean;
  };
  ctaHint: 'auth_required';
};

export type UserProfile = {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  viewerMode: ViewerMode;
  lockMetadata?: ProfileLockMetadata;
};

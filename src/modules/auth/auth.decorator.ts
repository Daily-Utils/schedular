import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_OPEN_FOR_DEVELOPMENT = 'isOpenForDevelopment';
export const OpenForDevelopment = () =>
  SetMetadata(IS_OPEN_FOR_DEVELOPMENT, true);

export const IS_CLOSED_FOR_USER = 'isClosedForUser';
export const ClosedForUser = () => SetMetadata(IS_CLOSED_FOR_USER, true);

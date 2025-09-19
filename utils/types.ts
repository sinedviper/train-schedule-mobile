export type TRole = 'USER' | 'ADMIN';

export type TTrainType =
  | 'HIGH_SPEED'
  | 'EXPRESS'
  | 'INTERCITY'
  | 'REGIONAL'
  | 'COMMUTER'
  | 'FREIGHT';

export enum ETrainType {
  REGIONAL = 'REGIONAL',
  INTERCITY = 'INTERCITY',
  HIGH_SPEED = 'HIGH_SPEED',
  EXPRESS = 'EXPRESS',
  COMMUTER = 'COMMUTER',
  FREIGHT = 'FREIGHT',
}

export interface IUser {
  id: number;
  name: string;
  role: TRole;
  login: string;
  createdAt: string;
}

export interface ISchedule {
  id: number;
  type: TTrainType;
  isFavorite: boolean;
  points: ISchedulePoint[];
  createdAt: string;
}

export interface IPagination<Data> {
  data: Data;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ISchedulePoint {
  id: number;
  timeToArrive: string;
  placeId: number;
  place: IPlace;
  createdAt: string;
}

export interface IPlace {
  id: number;
  name: string;
  createdAt: string;
}

export interface IFavoriteSchedule {
  id: number;
  userId: number;
  scheduleId: number;
  schedule: ISchedule;
  createdAt: string;
}

export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface IAuthRegistration {
  name: string;
  login: string;
  password: string;
  role: TRole;
}

// ---------------------------------------------------------

export interface ScheduleDeletedEvent {
  id: number;
}

export interface ScheduleForm {
  type: TTrainType;
  points: {
    placeId: number;
    timeToArrive: Date;
  }[];
}

export interface CreateScheduleDto {
  type: TTrainType;
  points: {
    placeId: number;
    timeToArrive: string;
  }[];
}

export interface UpdateScheduleDto extends Partial<CreateScheduleDto> {}

export interface CreatePlaceDto {
  name: string;
}

export interface UpdatePlaceDto {
  name?: string;
}

export interface UpdateProfileDto {
  name?: string;
  login?: string;
}

export interface UpdatePasswordProfileDto {
  oldPassword: string;
  newPassword: string;
}

export interface CreateFavoriteDto {
  scheduleId: number;
}

export interface IScheduleFilter {
  type?: TTrainType;
  startDate?: string;
  startPlaceId?: number;
  endDate?: string;
  endPlaceId?: number;
  page: number;
}

export interface IApiError {
  status: number;
  message: string;
  path: string;
}

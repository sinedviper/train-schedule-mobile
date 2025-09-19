import * as yup from 'yup';
import { ETrainType } from '@/utils/types';

// Auth validators
export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces')
    .min(1, 'Name must be at least 1 character')
    .max(50, 'Name must be at most 50 characters'),
  login: yup
    .string()
    .required('Login is required')
    .min(3, 'Login must be at least 3 characters')
    .max(15, 'Login must be at most 15 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(
      /(?=.*[a-z])/,
      'Password must contain at least one lowercase letter',
    )
    .matches(
      /(?=.*[A-Z])/,
      'Password must contain at least one uppercase letter',
    )
    .matches(/(?=.*\d)/, 'Password must contain at least one digit')
    .matches(
      /(?=.*[!@#$%^&*])/,
      'Password must contain at least one special character',
    ),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['USER', 'ADMIN'], 'Role must be USER or ADMIN'),
});

export const loginSchema = yup.object({
  login: yup.string().required('Login is required'),
  password: yup.string().required('Password is required'),
});

// Profile validators
export const updateProfileSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces')
    .min(1, 'Name must be at least 1 character')
    .max(50, 'Name must be at most 50 characters'),
  login: yup
    .string()
    .required('Login is required')
    .min(3, 'Login must be at least 3 characters')
    .max(15, 'Login must be at most 15 characters'),
});

// Train validators
export const trainSchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup
    .string()
    .required('Type is required')
    .oneOf(Object.values(ETrainType), 'Invalid train type'),
});

// Place validators
export const placeSchema = yup.object({
  name: yup.string().required('Name is required'),
});

// Schedule validators
export const scheduleSchema = yup.object({
  type: yup.string().required('Train type is required'),
  points: yup
    .array()
    .of(
      yup.object({
        placeId: yup.number().required('Place is required'),
        timeToArrive: yup.date().required('Arrival datetime is required'),
      }),
    )
    .min(2, 'Schedule must have at least 2 points')
    .required('Points are required'),
});

import { VIETNAMESE_PHONE_REGEX } from '@/src/constants';

export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

export const validateVietnamesePhoneNumber = (phoneNumber: string): boolean => {
  return VIETNAMESE_PHONE_REGEX.test(phoneNumber);
};

export const validatePassword = (pass: string): boolean => {
  return pass.length >= 8 && pass.length <= 20 && !/\s/.test(pass);
};

export const PHONE_NUMBER_EXAMPLES = [
  '0912345678',
  '0823456789',
  '0363456789',
  '+84912345678',
  '+84 98 765 4321',
];


import * as Yup from 'yup';

export const SignUpValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Це поле обовʼязкове')
    .min(3, 'Мінімум 3 символи')
    .max(20, 'Максимум 20 символів'),
  lastName: Yup.string()
    .required('Це поле обовʼязкове')
    .min(3, 'Мінімум 3 символи')
    .max(20, 'Максимум 20 символів'),
  email: Yup.string()
    .required('Це поле обовʼязкове')
    .email('Некоректний формат пошти'),
  password: Yup.string()
    .required('Це поле обовʼязкове')
    .min(8, 'Пароль має містити мінімум 8 символів')
    .max(24, 'Пароль має бути не більше 24 символів')
    .matches(
      /^[-a-zA-Z0-9 !"#$%&'()*+,.//:;<=>?@[\\\]^_`{|}~]*$/gm,
      'Пароль повинен містити лише англійські літери, цифри та спеціальні символи',
    )
    .matches(
      /[- !"#$%&'()*+,.//:;<=>?@[\\\]^_`{|}~]+$/gm,
      'Пароль повинен містити принаймні один спеціальний символ',
    ),
  confirmPassword: Yup.string()
    .required('Це поле обовʼязкове')
    .oneOf([Yup.ref('password'), null], 'Пароль не збігається'),
});

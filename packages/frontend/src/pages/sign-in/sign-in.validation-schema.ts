import * as Yup from 'yup';

export const SignInValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Це поле обовʼязкове')
    .email('Некоректний формат пошти'),
  password: Yup.string().required('Це поле обовʼязкове'),
});

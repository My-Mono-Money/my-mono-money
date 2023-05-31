import * as Yup from 'yup';

export const AddNewSharinglidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Це поле обовʼязкове')
    .email('Некоректний формат пошти'),
});

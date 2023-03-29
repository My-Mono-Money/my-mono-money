import * as Yup from 'yup';

export const SaveTokenValidationSchema = Yup.object().shape({
  tokenMonobank: Yup.string().required('Це поле обовʼязкове'),
});

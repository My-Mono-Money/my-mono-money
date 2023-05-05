import * as Yup from 'yup';

export const AddNewTokenalidationSchema = Yup.object().shape({
  tokenMonobank: Yup.string().required('Це поле обовʼязкове'),
});

interface ITestEmailTemplate {
  email: string;
}

export const testEmailTemplate = ({ email }: ITestEmailTemplate) => {
  return {
    to: {
      email,
      name: email.split('@')[0],
    },
    subject: 'Test Email',
    content: 'This is test for queue',
  };
};

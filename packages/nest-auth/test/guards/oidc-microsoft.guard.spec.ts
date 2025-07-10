import {OidcMicrosoftGuard} from '#/guards';

const makeSut = async () => {
  const req: any = {query: {state: 'state'}};
  const context = {switchToHttp: () => ({getRequest: () => req})} as any;
  const sut = new OidcMicrosoftGuard();
  return {req, context, sut};
};

describe('guards/microsoft-google.guard', () => {
  describe('getAuthenticateOptions', () => {
    it('return authenticateOptions without state', async () => {
      const {req, context, sut} = await makeSut();
      req.query.state = undefined;
      const result = sut.getAuthenticateOptions(context) as any;
      expect(result.state).toBeUndefined();
    });
    it('return authenticateOptions with state', async () => {
      const {context, sut} = await makeSut();
      const result = sut.getAuthenticateOptions(context) as any;
      expect(result.state).toBeDefined();
    });
  });
});

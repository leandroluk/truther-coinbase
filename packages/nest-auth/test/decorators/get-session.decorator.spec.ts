import {GetSession} from '#/decorators/get-session.decorator';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  createParamDecorator: v => v,
}));

describe('decorators/get-session.decorator', () => {
  it('should return the session from request', () => {
    const mockSession = 'mockSession';
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          session: mockSession,
        }),
      }),
    };
    const result = GetSession(undefined, mockContext);
    expect(result).toEqual(mockSession);
  });
});

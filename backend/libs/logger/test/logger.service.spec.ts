import {LoggerService} from '#/logger.service';

const makeSut = async (context?: any) => {
  const sut = new LoggerService(context);
  return {sut};
};

describe('logger.service', () => {
  it.each([
    ['string', 'context'],
    ['object', new Date()],
  ])('construct with %s as context', async (_, context) => {
    const {sut} = await makeSut(context);
    expect(sut).toBeDefined();
  });

  describe('formatPid', () => {
    it('return formated Pid', async () => {
      const {sut} = await makeSut();
      expect(sut.formatPid()).toBe('[] ');
    });
  });

  describe('setAppName', () => {
    it('set app name and return in formatted pid', async () => {
      const appName = 'appName';
      LoggerService.setAppName(appName);
      const {sut} = await makeSut();
      expect(sut.formatPid()).toBe(`[${appName}] `);
    });
  });
});

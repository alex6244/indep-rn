describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('shows home screen top bar on cold start', async () => {
    await expect(element(by.id('home-top-bar'))).toBeVisible();
  });
});

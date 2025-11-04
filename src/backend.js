exports.httpHandler = {
  endpoints: [
      {
          method: 'POST',
          path: 'saveFlag',
          handle: async function handle(ctx) {
              const body = await ctx.request.body('value');
              const {value} = JSON.parse(body);
              ctx.storage.set('backendFlag', value);

              return ctx.response.json({ value: value });
          }
      },
      {
          method: 'GET',
          path: 'getFlag',
          handle: async function handle(ctx) {
              const value = ctx.storage.get('backendFlag');
              return ctx.response.json({ value: value });
          }
      }
  ]
};

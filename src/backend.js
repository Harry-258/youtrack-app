exports.httpHandler = {
  endpoints: [
      {
          method: 'POST',
          path: 'flag',
          handle: async function handle(ctx) {
              const body = await ctx.request.body;
              const newFlagValue = JSON.parse(body).value;
              // await ctx.storage.set('backendFlag', newFlagValue);

              return ctx.response.json({value: newFlagValue});
          }
      },
      {
          method: 'GET',
          path: 'flag',
          handle: async function handle(ctx) {
              // const flagValue = (await ctx.storage.get('backendFlag')) ?? "false";
              return ctx.response.json({value: false});
          }
      }
  ]
};

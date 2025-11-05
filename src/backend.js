exports.httpHandler = {
  endpoints: [
      {
          method: 'POST',
          path: 'flag',
          handle: async function handle(ctx) {
              const body = await ctx.request.body;
              const newFlagValue = JSON.parse(body).value;

              return ctx.response.json({value: newFlagValue});
          }
      },
      {
          method: 'GET',
          path: 'flag',
          handle: async function handle(ctx) {
              return ctx.response.json({value: false});
          }
      }
  ]
};

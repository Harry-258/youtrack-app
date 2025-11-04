exports.httpHandler = {
  endpoints: [
      {
          method: 'POST',
          path: 'flag',
          handle: function handle(ctx) {
              const requestParam = ctx.request.getParameter('value');
              // TODO: store it in backend
          }
      }
  ]
};

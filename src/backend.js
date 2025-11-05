exports.httpHandler = {
    endpoints: [
        {
            method: 'PUT',
            path: 'flag',
            // to call this handler from App Widget, run
            // `const res = await host.fetchApp('backend/flag', {method: 'PUT', query: {test: '123'}})`
            handle: async function handle(ctx) {
                ctx.globalStorage.extensionProperties.flag = ctx.request.getParameter('value');
                ctx.response.json({value: false});
            }
        },
        {
            method: 'GET',
            path: 'flag',
            // to call this handler from App Widget, run
            // `const res = await host.fetchApp('backend/flag', {method: 'PUT', query: {test: '123'}})`
            handle: async function handle(ctx) {
                ctx.response.json({value: ctx.globalStorage.extensionProperties.flag});
            }
        },
    ]
};

exports.httpHandler = {
    endpoints: [
        {
            method: 'PUT',
            path: 'flag',
            handle: async function handle(ctx) {
                const body = await ctx.request.body;
                const newFlagValue = JSON.parse(body).value;
                ctx.globalStorage.extensionProperties.flag = newFlagValue;

                ctx.response.json({value: newFlagValue});
            }
        },
        {
            method: 'GET',
            path: 'flag',
            handle: async function handle(ctx) {
                ctx.response.json({value: ctx.globalStorage.extensionProperties.flag});
            }
        },
    ]
};

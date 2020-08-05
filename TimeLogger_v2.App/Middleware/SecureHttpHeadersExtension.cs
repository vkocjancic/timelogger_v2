using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Middleware
{

    public static class SecureHttpHeadersExtension
    {

        public static IApplicationBuilder UseSecureHttpHeaders(this IApplicationBuilder builder, IWebHostEnvironment env)
        {
            return builder.UseMiddleware<SecureHttpHeadersMiddleware>(env);
        }

    }

}

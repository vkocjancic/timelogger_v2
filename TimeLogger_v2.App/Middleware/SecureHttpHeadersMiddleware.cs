using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Middleware
{
    public class SecureHttpHeadersMiddleware
    {
        
        #region Fields

        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _env;

        #endregion

        #region Constructors

        public SecureHttpHeadersMiddleware(RequestDelegate next, IWebHostEnvironment env)
        {
            _env = env;
            _next = next;
        }

        #endregion

        #region Invoke methods

        public async Task Invoke(HttpContext context)
        {
            context.Response.OnStarting(() =>
            {
                // remove leaky headers
                context.Response.Headers[HeaderNames.Server] = "TimeLogger_v2";
                context.Response.Headers.Remove("x-powered-by");
                context.Response.Headers.Remove("X-AspNet-Version");

                // add security headers
                if (_env.IsDevelopment())
                {
                    context.Response.Headers.Append(HeaderNames.AccessControlAllowOrigin, "*");
                }
                else
                {
                    context.Response.Headers.Append(HeaderNames.AccessControlAllowOrigin, "timelogger.eu");
                }
                context.Response.Headers.Append(HeaderNames.AccessControlAllowMethods, "GET, POST, PUT, OPTIONS");
                context.Response.Headers["Alt-Svc"] = "quic=\":443\"; ma=3600";
                context.Response.Headers.Append(HeaderNames.ContentSecurityPolicy, "default-src 'self' https://v2.timelogger.eu https://cdnjs.cloudflare.com; img-src 'self' data:; object-src 'none'; script-src 'self' 'unsafe-eval' https://v2.timelogger.eu https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' https://v2.timelogger.eu https://cdnjs.cloudflare.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");
                context.Response.Headers["Expect-CT"] = "max-age=604800";
                context.Response.Headers["Feature-Policy"] = "ambient-light-sensor: 'none'; autoplay: 'none'; accelerometer: 'none'; camera: 'none'; " +
                    "display-capture: 'none'; document-domain: 'none'; encrypted-media: 'none'; geolocation: 'none'; gyroscope: none'; " +
                    "magnetometer: 'none'; microphone: 'none'; midi: 'none'; payment: 'none'; picture-in-picture: 'none'; speaker: 'none'; " +
                    "sync-xhr: 'none'; usb: 'none'; wake-lock: 'none'; webauthn: 'self'; vr: 'none'";
                context.Response.Headers.Append(HeaderNames.StrictTransportSecurity, "max-age=10886400; includeSubDomains");
                context.Response.Headers["X-Content-Type-Options"] = "nosniff";
                context.Response.Headers["X-Frame-Options"] = "SAMEORIGIN";
                context.Response.Headers["X-XSS-Protection"] = "1; mode=block";

                return Task.FromResult(0);
            });
            await _next.Invoke(context);
        }

        #endregion

    }
}

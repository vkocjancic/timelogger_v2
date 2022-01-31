using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TimeLogger_v2.Database.Account;
using TimeLogger_v2.App.Middleware;
using TimeLogger_v2.Core.DAL;
using TimeLogger_v2.Core.DAL.Account;
using TimeLogger_v2.Core.Notifications;
using TimeLogger_v2.Core.Templating;
using TimeLogger_v2.Core.DAL.Project;
using TimeLogger_v2.Database.Project;
using TimeLogger_v2.Core.DAL.TimeLog;
using TimeLogger_v2.Database.TimeEntry;

namespace TimeLogger_v2.App
{
    public class Startup
    {

        #region Properties

        public IConfiguration Configuration { get; set; }
        public IWebHostEnvironment WebHostEnvironment { get; set; }

        #endregion

        #region Constructors

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            WebHostEnvironment = environment;
        }

        #endregion

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            services.AddResponseCompression();
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.Name = "auth_cookie";
                    options.Cookie.SameSite = SameSiteMode.None;
                    options.Events = new CookieAuthenticationEvents
                    {
                        OnRedirectToLogin = redirectContext =>
                        {
                            redirectContext.HttpContext.Response.StatusCode = 401;
                            return Task.CompletedTask;
                        }
                    };
                });
            services.AddAuthorization();
            services.AddMvcCore(options => options.EnableEndpointRouting = false)
                .AddFormatterMappings()
                .AddJsonOptions(o =>
                {
                    o.JsonSerializerOptions.PropertyNamingPolicy = null;
                })
                .AddCors();
            services.Configure<SmtpOptions>(Configuration.GetSection(nameof(SmtpOptions)));
            // custom services
            services.AddTransient<TemplateHelperBase, FileTemplateHelper>(x => 
                new FileTemplateHelper(System.IO.Path.Combine(WebHostEnvironment.WebRootPath, Configuration.GetValue("TemplatesPath", "templates"))));
            services.AddTransient<IAccountService, AccountService>();
            services.AddTransient<INotificationService, NotificationService>();
            services.AddTransient<IProjectService, ProjectService>();
            services.AddTransient<ITimeEntryService, TimeEntryService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseSecureHttpHeaders(env);
            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = context =>
                {
                    context.Context.Response.Headers["Cache-Control"] = "private, max-age=2592000";
                    context.Context.Response.Headers["Expires"] = DateTime.UtcNow.AddMonths(1).ToString("R");
                }
            });
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseResponseCompression();
            app.UseMvc();
        }
    }
}

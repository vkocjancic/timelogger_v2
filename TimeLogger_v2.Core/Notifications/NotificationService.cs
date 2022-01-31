using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using TimeLogger_v2.Core.DAL.Account;
using TimeLogger_v2.Core.Templating;

namespace TimeLogger_v2.Core.Notifications
{
    public class NotificationService : INotificationService
    {

        #region Declarations

        private SmtpOptions _options;
        private TemplateHelperBase _templateHelper;

        #endregion


        #region Constructors

        public NotificationService(TemplateHelperBase templateHelper, IOptions<SmtpOptions> options)
        {
            _options = options.Value;
            _templateHelper = templateHelper;
        }

        #endregion

        #region INotificationService

        public Task SendCreateAccountMessage(string username)
        {
            var notification = new CreateAccountNotification(_options, _templateHelper);
            return notification.SendAsync(username);
        }

        public Task SendPasswordChangedMessage(PasswordReset pwdReset)
        {
            var notification = new PasswordChangedNotification(_options, _templateHelper, pwdReset);
            return notification.SendAsync(pwdReset.Username);
        }

        public Task SendPasswordResetMessage(PasswordReset pwdReset)
        {
            var notification = new PasswordResetNotification(_options, _templateHelper, pwdReset);
            return notification.SendAsync(pwdReset.Username);
        }

        #endregion

    }
}

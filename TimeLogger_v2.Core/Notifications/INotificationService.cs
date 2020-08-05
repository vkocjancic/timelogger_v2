using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Timelogger_v2.Core.DAL.Account;

namespace TimeLogger_v2.Core.Notifications
{
    public interface INotificationService
    {
        Task SendCreateAccountMessage(string username);
        Task SendPasswordResetMessage(PasswordReset pwdReset);
        Task SendPasswordChangedMessage(PasswordReset pwdReset);
    }
}

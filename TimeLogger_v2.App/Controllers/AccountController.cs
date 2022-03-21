using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TimeLogger_v2.App.Adapter;
using TimeLogger_v2.App.Model;
using TimeLogger_v2.Core.DAL.Account;
using TimeLogger_v2.Core.Notifications;

namespace TimeLogger_v2.App.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        #region Declarations

        private readonly IAccountService _accountService;
        private readonly INotificationService _notificationService;
        private readonly ILogger<AccountController> _logger;

        #endregion

        #region Constructors

        public AccountController(ILogger<AccountController> logger, IAccountService accountService, INotificationService notificationService)
        {
            _accountService = accountService;
            _logger = logger;
            _notificationService = notificationService;
        }

        #endregion

        #region API methods

        [AllowAnonymous, HttpPost]
        public async Task<IActionResult> Create([FromBody] AccountModel model)
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tCreate account attempt for user '{1}'", remoteIpAddress, model.Username);
            if (string.IsNullOrWhiteSpace(model.Username)
                || !(new EmailAddressAttribute().IsValid(model.Username))
                || string.IsNullOrWhiteSpace(model.Password) 
                || string.IsNullOrWhiteSpace(model.PasswordCheck)
                || model.Password != model.PasswordCheck
                || model.Password.Length < 16)
            {
                return BadRequest("Invalid username or password.");
            }
            if (!await _accountService.CanRegister(remoteIpAddress, model.Username))
            {
                _logger.LogInformation("{0}\tCreating account for user '{1}' failed. User already exists.", remoteIpAddress, model.Username);
                return Redirect("/login");
            }
            if (await _accountService.CreateAccount(model.Username, model.Password))
            {
                try
                {
                    await _notificationService.SendCreateAccountMessage(model.Username);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "{0}\tCreateAccount Error", remoteIpAddress);
                    return BadRequest(ex.Message);
                }
            }
            else 
            {
                _logger.LogInformation("{0}\tCreating account for user '{1}' failed. Could not create user account.", remoteIpAddress, model.Username);
                return BadRequest("Could not create user account. Please try again later.");
            }
            return Created("/create", model.Username);
        }

        [AllowAnonymous, HttpPost]
        public async Task<IActionResult> Forgot([FromBody] AccountModel model)
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tPassword recovery attempt for user '{1}'", remoteIpAddress, model.Username);
            if (string.IsNullOrWhiteSpace(model.Username)
                || !(new EmailAddressAttribute().IsValid(model.Username)))
            {
                return BadRequest("Invalid username or e-mail address.");
            }
            if (!await _accountService.CanResetPassword(remoteIpAddress, model.Username))
            {
                _logger.LogInformation("{0}\tInvalid password recover request for user '{1}'.");
                return Ok();
            }
            var pwdResetEntry = await _accountService.CreatePasswordResetEntry(remoteIpAddress, model.Username);
            if (null != pwdResetEntry)
            {
                try
                {
                    await _notificationService.SendPasswordResetMessage(pwdResetEntry);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "{0}\tPassword recovery error", remoteIpAddress);
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                _logger.LogInformation("{0}\tPassword recovery for user '{1}' failed. Could not create password recovery entry.", remoteIpAddress, model.Username);
                return BadRequest("Could not create password recovery request. Please try again later.");
            }
            return Ok();
        }

        [AllowAnonymous, HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tLogin attempt for user '{1}'", remoteIpAddress, model.Username);
            if (!await _accountService.CanLogin(remoteIpAddress, model.Username)) 
            {
                var nextLoginTimeout = await _accountService.GetNextLoginTimeout(remoteIpAddress, model.Username);
                _logger.LogInformation("{0}\tLogin failed for user '{1}'\ttoo soon\tnext login in {2}s", remoteIpAddress, model.Username, nextLoginTimeout);
                await _accountService.InsertLoginAttempt(remoteIpAddress, model.Username, false);
                return Unauthorized(new { nextLoginTimeout = nextLoginTimeout });
            }
            if (!await _accountService.AreCredentialsValid(model.Username, model.Password))
            {
                var nextLoginTimeout = await _accountService.GetNextLoginTimeout(remoteIpAddress, model.Username);
                _logger.LogInformation("{0}\tLogin failed for user '{1}'\tinvalid credentials\tnext login in {2}s", remoteIpAddress, model.Username, nextLoginTimeout);
                await _accountService.InsertLoginAttempt(remoteIpAddress, model.Username, false);
                return Unauthorized(new { nextLoginTimeout = nextLoginTimeout });
            }
            var modelResponse = new AccountDetailsModel(model.Username);
            Account account = await _accountService.GetAccountDetails(model.Username);
            if (null != account)
            {
                if (!string.IsNullOrEmpty(account.AccountType))
                {
                    modelResponse.AccountType = account.AccountType;
                }
                if (account.ExpiresDate.HasValue)
                {
                    modelResponse.ExpiresIsoDate = account.ExpiresDate.Value.ToString("yyyy-MM-dd");
                }
            }
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, model.Username),
                new Claim(ClaimTypes.Email, model.Username),
                new Claim(ClaimTypes.Role, "User"),
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties()
            {
                IsPersistent = true,
            };
            try
            {
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{0}\tLogin error", remoteIpAddress);
                return BadRequest(ex.Message);
            }
            await _accountService.InsertLoginAttempt(remoteIpAddress, model.Username, true);
            _logger.LogInformation("{0}\tLogin successful for user '{1}'", remoteIpAddress, model.Username);
            return Ok(modelResponse);
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tLogout attempt for user '{1}'", remoteIpAddress, Request.HttpContext.User.Identity.Name);
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            _logger.LogInformation("{0}\tLogout attempt for user '{1}'", remoteIpAddress, Request.HttpContext.User.Identity.Name);
            return NoContent();
        } 

        [HttpPost]
        public async Task<IActionResult> PasswordReset([FromBody] AccountModel model)
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tPassword reset attempt attempt for pwd reset id '{1}'", remoteIpAddress, model.PasswordResetId);
            if (string.IsNullOrWhiteSpace(model.Password)
                || string.IsNullOrWhiteSpace(model.PasswordCheck)
                || model.Password != model.PasswordCheck
                || model.Password.Length < 16)
            {
                return BadRequest("Invalid password.");
            }
            if (!await _accountService.CanResetPassword(remoteIpAddress, model.PasswordResetId))
            {
                _logger.LogInformation("{0}\tResetting password for id '{1}' failed. No password reset request found.", remoteIpAddress, model.PasswordResetId);
                return Redirect("/login");
            }
            var pwdReset = await _accountService.ResetPassword(model.PasswordResetId, model.Password);
            if (null != pwdReset)
            {
                try
                {
                    await _notificationService.SendPasswordChangedMessage(pwdReset);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "{0}\tPassword reset error", remoteIpAddress);
                    return BadRequest("Could not reset your password. Please, try again later.");
                }
            }
            else
            {
                _logger.LogInformation("{0}\tPassword reset for id '{1}' failed. Could not update account entry.", remoteIpAddress, model.PasswordResetId);
                return BadRequest("Could not reset your password. Please, try again later.");
            }
            return Created("/passwordreset", model.Username);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubscriptionList()
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tObtaining subscription list fo user '{1}'", remoteIpAddress, Request.HttpContext.User.Identity.Name);
            IEnumerable<Plan> plansFromDb = await _accountService.GetSubscriptionList(Request.HttpContext.User.Identity.Name);
            var plans = new List<PlanModel>(plansFromDb.Count());
            var adapter = new PlanAdapter();
            plans.AddRange(adapter.FromDomainBulk(plansFromDb));
            _logger.LogInformation("{0}\tList subscriptions for user '{1}' and found {2} subscription(s)", remoteIpAddress, Request.HttpContext.User.Identity.Name, plans.Count);
            return Ok(plans);
        }

        #endregion

    }
}
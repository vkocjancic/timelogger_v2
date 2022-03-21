using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeLogger_v2.App.Model;
using TimeLogger_v2.Core.DAL.Account;

namespace TimeLogger_v2.App.Adapter
{
    public class PlanAdapter : AdapterBase<PlanModel, Plan>
    {

        #region IAdapter implementation
        
        public override PlanModel FromDomain(Plan domain)
        {
            return new PlanModel()
            {
                Code = domain.Code,
                ExpireYears = domain.ExpireYears,
                Info = domain.Info,
                Mode = domain.Mode,
                Price = domain.Price,
                Title = domain.Title
            };
        }

        public override Plan ToDomain(PlanModel model)
        {
            throw new NotImplementedException();
        }

        #endregion

    }
}

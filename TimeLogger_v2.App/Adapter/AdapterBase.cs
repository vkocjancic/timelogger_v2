using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Adapter
{
    public abstract class AdapterBase<TModel, TDomain> : IAdapter<TModel, TDomain>
    {

        #region IAdapter implementation

        public abstract TModel FromDomain(TDomain domain);

        public abstract TDomain ToDomain(TModel model);

        #endregion

        #region Bulk methods

        public IEnumerable<TModel> FromDomainBulk(IEnumerable<TDomain> domainItems)
        {
            foreach(var domainItem in domainItems ?? Array.Empty<TDomain>())
            {
                yield return FromDomain(domainItem);
            }
        }

        #endregion

    }
}

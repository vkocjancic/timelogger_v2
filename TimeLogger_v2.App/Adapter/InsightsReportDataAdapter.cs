using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeLogger_v2.App.Model;
using TimeLogger_v2.Core.DAL.Insights;

namespace TimeLogger_v2.App.Adapter
{
    public class InsightsReportDataAdapter : AdapterBase<InsightsReportItemModel, ReportItem>
    {

        #region IAdapeter implementation

        public override InsightsReportItemModel FromDomain(ReportItem domain)
        {
            return new InsightsReportItemModel()
            {
                Tag = domain.Tag,
                Duration = domain.Duration
            };
        }

        public override ReportItem ToDomain(InsightsReportItemModel model)
        {
            throw new NotImplementedException();
        }

        #endregion

    }
}

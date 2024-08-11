export const DashboardPage = () => {
  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2"></div>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-8">
          <>
            {/* Simple Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
              {/* Card: Simple Widget */}
              <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
                {/* Card Body: Simple Widget */}
                <div className="p-5 lg:p-6 grow w-full">
                  <dl>
                    <dt className="text-2xl font-semibold">87</dt>
                    <dd className="uppercase font-medium text-sm text-gray-500 tracking-wider">
                      Sales
                    </dd>
                  </dl>
                </div>
                {/* END Card Body: Simple Widget */}
              </div>
              {/* END Card: Simple Widget */}
              {/* Card: Simple Widget */}
              <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
                {/* Card Body: Simple Widget */}
                <div className="p-5 lg:p-6 grow w-full">
                  <dl>
                    <dt className="text-2xl font-semibold">$4,570</dt>
                    <dd className="uppercase font-medium text-sm text-gray-500 tracking-wider">
                      Earnings
                    </dd>
                  </dl>
                </div>
                {/* END Card Body: Simple Widget */}
              </div>
              {/* END Card: Simple Widget */}
              {/* Card: Simple Widget */}
              <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
                {/* Card Body: Simple Widget */}
                <div className="p-5 lg:p-6 grow w-full">
                  <dl>
                    <dt className="text-2xl font-semibold">$27,910</dt>
                    <dd className="uppercase font-medium text-sm text-gray-500 tracking-wider">
                      Wallet
                    </dd>
                  </dl>
                </div>
                {/* END Card Body: Simple Widget */}
              </div>
              {/* END Card: Simple Widget */}
            </div>
            {/* END Simple Statistics Grid */}
          </>
        </div>
      </div>
    </div>
  );
};

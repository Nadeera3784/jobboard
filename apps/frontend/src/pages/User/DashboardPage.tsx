export const DashboardPage = () => {
  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-gray-600 h-9 px-4 py-2">
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                New Category
              </button>
            </div>
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

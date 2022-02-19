import React from "react";
import withContractData from "../../../../hoc/with-contract-data";
import PoolList from "../../molecules/pool-list";

export default ({ getDataMethod, title = "" }) => {
  return (
    <div className="col-md-4 col-sm-12 d-flex p-2 flex-column align-items-center">
      <h3>{title}</h3>
      {/* {withContractData({
        getDataMethod,
      })(PoolList)} */}
    </div>
  );
};

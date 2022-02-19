import React from "react";
import PoolListContainer from "../../components/pools/organisms/pool-list-container";

export default () => {
  return (
    <div className="container">
      <div className="row">
          <PoolListContainer title="Active"/>
          <PoolListContainer title="Ended"/>
          <PoolListContainer title="Not Started jet"/>
      </div>
    </div>
  );
};

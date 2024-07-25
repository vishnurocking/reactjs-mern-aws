import React from "react";

function DetailsCardComponent({ sn, userN, email }) {
  return (
    <div class="card my-2">
      <div class="card-body">
        <h5>
          UserId: {sn} <br />
          User Name: {userN} <br />
          Email: {email}
        </h5>
      </div>
    </div>
  );
}

export default DetailsCardComponent;

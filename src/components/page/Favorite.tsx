import { connect } from "react-redux";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faStar } from "@fortawesome/free-solid-svg-icons";

const NoFavorite = () => {
  return (
    <div className="notification is-info">
      <p>No pastes found.</p>

      <div className="media">
        <div className="media-left">
          <FontAwesomeIcon icon={faLightbulb} />
        </div>
        <div className="media-content">
          <p>
            1. Paste IPFS link to the search box in the top right.
            <br />
            2. Push <FontAwesomeIcon icon={faStar} />
          </p>
        </div>
      </div>
    </div>
  );
};

const Favorite = () => {
  return (
    <section className="section">
      <div className="container">
        <NoFavorite />
      </div>
    </section>
  );
};

export default connect()(Favorite);

import React from "react";
import "../App.scss";

class RefreshRadioButton extends React.Component {
  render() {
    return (
      <div className="radio-component-container">
        <label htmlFor="radio-div">Refresh Rates Every:</label>
        <div
          id="radio-div"
          className="radio-container"
          onChange={(e) => this.props.frequencyChange(e)}
        >
          <div>
            <input
              id="five"
              type="radio"
              value={5000}
              name="frequency"
              defaultChecked
            />
            <label htmlFor="five">5 seconds</label>
          </div>
          <div>
            <input id="ten" type="radio" value={10000} name="frequency" />
            <label htmlFor="ten">10 seconds</label>
          </div>
          <div>
            <input id="fifteen" type="radio" value={15000} name="frequency" />
            <label htmlFor="fifteen">15 seconds</label>
          </div>
        </div>
      </div>
    );
  }
}

export default RefreshRadioButton;

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Summary

The table was created using React (class components) and Material UI components. 

Material UI was chosen as there is an established libary of pre-styled and structured components (ex. the table set consists of a table wrapper and row components) which let me focus on the data transformations. With regards to styling, SCSS was used minimally as Material UI requires styling through their "withStyles" HOC or through styled components in React. 

An additional Filtering feature was added to make the table contents easier to sift through and navigate. A user can choose a base coin to view and will see the different exchange rates accross all other coin.

The coin filtering is not affected by the polling feature. When polling for new data, the filter should not be earased from the application state. For example, If BTC is chosen in the filter, upon re-fetching the API data, BTC should still be the only coin base rendering in the app.
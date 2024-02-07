import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignUp from './SignUp';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path='/users' element={<SignUp />}>
            <SignUp />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;

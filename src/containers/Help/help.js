import React, { Component } from 'react';

import styles from './help.css';

class Help extends Component {
  render() {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>/ App development tool</h2>
        <ol>
          <li>
            <h3>Install the latest version of CYB package</h3>
            <pre>npm install -g cyb</pre>
          </li>

          <li>
            <h3>Select the path where you want to store your app. For example /Desktop/My_apps</h3>
            <pre>cd <strong>username</strong>/Desktop/My_apps</pre>
          </li>

          <li>
            <h3>Enter the name and generate the structure of the app. A folder with all necessary components will be created</h3>
            <pre>cyb init <strong>appname</strong></pre>
          </li>

          <li>
            <h3>Go to the app folder and link your app with Chaingear registry</h3>
            <pre>cyb link</pre>
          </li>

          <li>
            <h3>Open the Appstore in CYB. You will see your app on «Your app» page</h3>
          </li>
        </ol>
      </div>
    );
  }
}

export default Help;

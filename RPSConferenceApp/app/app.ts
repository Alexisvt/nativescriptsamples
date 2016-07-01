import * as application from 'application';
import * as navigationModule from './shared/navigation';

application.mainModule =  navigationModule.startingPage();
application.cssFile = 'styles/app.css';
application.start();